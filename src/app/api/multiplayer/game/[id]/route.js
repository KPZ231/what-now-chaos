import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Helper function to validate participant belongs to game
async function validateParticipant(gameId, participantId) {
  const participant = await prisma.multiplayerParticipant.findFirst({
    where: {
      id: participantId,
      gameId: gameId
    }
  });
  
  return participant ? true : false;
}

// Get game details
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    // Validate input
    if (!id) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }
    
    // Check if user has the right to view this game
    const participantId = request.nextUrl.searchParams.get('participantId');
    
    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
    }
    
    // Validate participant belongs to game
    const isValidParticipant = await validateParticipant(id, participantId);
    if (!isValidParticipant) {
      return NextResponse.json({ error: 'Invalid participant' }, { status: 403 });
    }
    
    // Get game details with participants
    const game = await prisma.multiplayerGame.findUnique({
      where: { id },
      include: {
        participants: {
          orderBy: {
            turnOrder: 'asc'
          }
        },
        completedTasks: {
          orderBy: {
            completedAt: 'desc'
          },
          take: 10
        }
      }
    });
    
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    // Update participant's last active timestamp
    await prisma.multiplayerParticipant.update({
      where: {
        id: participantId
      },
      data: {
        lastActive: new Date(),
        isActive: true
      }
    });
    
    return NextResponse.json({
      success: true,
      game
    });
    
  } catch (error) {
    console.error('Error fetching game details:', error);
    return NextResponse.json({ error: 'Failed to fetch game details' }, { status: 500 });
  }
}

// Update participant status (ready, not ready)
export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Validate input
    if (!id || !data.participantId) {
      return NextResponse.json({ error: 'Game ID and participant ID are required' }, { status: 400 });
    }
    
    // Validate participant belongs to game
    const isValidParticipant = await validateParticipant(id, data.participantId);
    if (!isValidParticipant) {
      return NextResponse.json({ error: 'Invalid participant' }, { status: 403 });
    }
    
    // Update participant status
    const updateData = {
      lastActive: new Date()
    };

    // Handle isReady status update
    if (data.isReady !== undefined) {
      updateData.isReady = data.isReady === true;
    }
    
    // Handle session leaving (marking participant as inactive)
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive === true;
    }
    
    const participant = await prisma.multiplayerParticipant.update({
      where: {
        id: data.participantId
      },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      participant
    });
    
  } catch (error) {
    console.error('Error updating participant status:', error);
    return NextResponse.json({ error: 'Failed to update participant status' }, { status: 500 });
  }
} 