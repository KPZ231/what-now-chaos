import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Helper function to validate if it's the user's turn
async function validateTurn(gameId, participantId) {
  const game = await prisma.multiplayerGame.findUnique({
    where: { id: gameId }
  });
  
  return game && game.currentTurn === participantId;
}

// Helper function to select next player in turn order
async function selectNextPlayer(gameId, currentParticipantId) {
  // Get all active participants in turn order
  const participants = await prisma.multiplayerParticipant.findMany({
    where: {
      gameId,
      isActive: true
    },
    orderBy: {
      turnOrder: 'asc'
    }
  });
  
  if (participants.length === 0) {
    throw new Error('No active participants found');
  }
  
  // Find current participant's index
  const currentIndex = participants.findIndex(p => p.id === currentParticipantId);
  
  // If not found or last one, start from beginning
  if (currentIndex === -1 || currentIndex === participants.length - 1) {
    return participants[0].id;
  }
  
  // Return next participant
  return participants[currentIndex + 1].id;
}

// Helper function to select a random task
async function selectRandomTask(gameId, mode) {
  try {
    // Fetch tasks data from JSON
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/data/tasks-${mode}.json`);
    const data = await response.json();
    
    if (!data.tasks || data.tasks.length === 0) {
      throw new Error('No tasks available');
    }
    
    // Get recently used tasks to avoid repetition
    const recentTasks = await prisma.multiplayerCompletedTask.findMany({
      where: { gameId },
      orderBy: { completedAt: 'desc' },
      take: 10
    });
    
    const recentTaskIds = recentTasks.map(task => task.taskId);
    
    // Filter out recent tasks
    const availableTasks = data.tasks.filter(task => !recentTaskIds.includes(task.id));
    
    // If all tasks have been used, just pick a random one
    const taskPool = availableTasks.length > 0 ? availableTasks : data.tasks;
    const randomIndex = Math.floor(Math.random() * taskPool.length);
    const selectedTask = taskPool[randomIndex];
    
    return selectedTask;
  } catch (error) {
    console.error('Error selecting random task:', error);
    throw error;
  }
}

// Handle task completion or skipping
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Validate input
    if (!id || !data.participantId) {
      return NextResponse.json({ error: 'Game ID and participant ID are required' }, { status: 400 });
    }
    
    if (!['complete', 'skip'].includes(data.action)) {
      return NextResponse.json({ error: 'Action must be either complete or skip' }, { status: 400 });
    }
    
    // Validate it's the user's turn
    const isUsersTurn = await validateTurn(id, data.participantId);
    if (!isUsersTurn) {
      return NextResponse.json({ error: 'It is not your turn' }, { status: 403 });
    }
    
    // Get current game state
    const game = await prisma.multiplayerGame.findUnique({
      where: { id },
      include: {
        participants: {
          where: { id: data.participantId }
        }
      }
    });
    
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    if (game.status !== 'active') {
      return NextResponse.json({ error: 'Game is not active' }, { status: 400 });
    }
    
    if (!game.currentTaskId || !game.currentTaskContent) {
      return NextResponse.json({ error: 'No active task' }, { status: 400 });
    }
    
    // Record task completion/skip
    await prisma.multiplayerCompletedTask.create({
      data: {
        taskId: game.currentTaskId,
        taskContent: game.currentTaskContent,
        skipped: data.action === 'skip',
        gameId: id,
        completedById: data.participantId
      }
    });
    
    // Update participant stats
    await prisma.multiplayerParticipant.update({
      where: { id: data.participantId },
      data: {
        tasksCompleted: data.action === 'complete' ? { increment: 1 } : undefined,
        tasksSkipped: data.action === 'skip' ? { increment: 1 } : undefined,
        lastActive: new Date()
      }
    });
    
    // Select next player
    const nextParticipantId = await selectNextPlayer(id, data.participantId);
    
    // Select new random task
    const nextTask = await selectRandomTask(id, game.mode);
    
    // Update game state
    const updatedGame = await prisma.multiplayerGame.update({
      where: { id },
      data: {
        currentTaskId: nextTask.id,
        currentTaskContent: nextTask.content,
        currentTurn: nextParticipantId,
        lastTaskChange: new Date()
      },
      include: {
        participants: {
          orderBy: {
            turnOrder: 'asc'
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      game: updatedGame
    });
    
  } catch (error) {
    console.error('Error handling task action:', error);
    return NextResponse.json({ error: 'Failed to process task action' }, { status: 500 });
  }
} 