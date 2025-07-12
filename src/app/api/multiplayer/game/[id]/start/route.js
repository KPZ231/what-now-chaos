import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

// Helper function to validate if user is the host
async function validateHost(gameId, participantId) {
  const game = await prisma.multiplayerGame.findUnique({
    where: { id: gameId },
    include: {
      participants: {
        where: {
          id: participantId,
          turnOrder: 0 // Host is always turnOrder 0
        }
      }
    }
  });
  
  return game && game.participants.length > 0;
}

// Helper function to select a random task
async function selectRandomTask(gameId, mode) {
  try {
    // Read tasks file directly from filesystem to avoid fetch issues
    const filePath = path.join(process.cwd(), 'public', 'data', `tasks-${mode}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
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

// Start a multiplayer game
export async function POST(request, { params }) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Validate input
    if (!id || !data.participantId) {
      return NextResponse.json({ error: 'Game ID and participant ID are required' }, { status: 400 });
    }
    
    // Validate user is the host
    const isHost = await validateHost(id, data.participantId);
    if (!isHost) {
      return NextResponse.json({ error: 'Only the host can start the game' }, { status: 403 });
    }
    
    // Get game details
    const game = await prisma.multiplayerGame.findUnique({
      where: { id },
      include: {
        participants: {
          orderBy: {
            turnOrder: 'asc'
          }
        }
      }
    });
    
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    // Check if all participants are ready
    const allReady = game.participants.every(p => p.isReady);
    if (!allReady && !data.forceStart) {
      return NextResponse.json({ error: 'Not all participants are ready' }, { status: 400 });
    }
    
    // Need at least 2 players unless forceStart is true
    if (game.participants.length < 2 && !data.forceStart) {
      return NextResponse.json({ error: 'Need at least 2 players to start' }, { status: 400 });
    }
    
    // Select first random task
    const firstTask = await selectRandomTask(id, game.mode);
    
    // Start the game - set status to active and select first player and task
    const updatedGame = await prisma.multiplayerGame.update({
      where: { id },
      data: {
        status: 'active',
        currentTaskId: firstTask.id,
        currentTaskContent: firstTask.content,
        currentTurn: game.participants[0].id,
        lastTaskChange: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      game: updatedGame
    });
    
  } catch (error) {
    console.error('Error starting multiplayer game:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
} 