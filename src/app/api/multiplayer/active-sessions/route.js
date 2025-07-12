import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Get active multiplayer sessions for the current user
export async function GET(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify token
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Find active multiplayer games the user is participating in
    const activeParticipation = await prisma.multiplayerParticipant.findFirst({
      where: {
        userId: user.id,
        isActive: true,
        game: {
          status: {
            in: ['lobby', 'active'] // Only consider active or lobby games
          }
        }
      },
      include: {
        game: {
          select: {
            id: true,
            mode: true,
            status: true,
            joinCode: true
          }
        }
      },
      orderBy: {
        joinedAt: 'desc' // Get most recent first
      }
    });
    
    if (activeParticipation && activeParticipation.game) {
      // Verify the game still exists and is valid
      const gameExists = await prisma.multiplayerGame.findUnique({
        where: {
          id: activeParticipation.gameId
        }
      });
      
      if (!gameExists) {
        // Mark the participant as inactive since game doesn't exist
        await prisma.multiplayerParticipant.update({
          where: {
            id: activeParticipation.id
          },
          data: {
            isActive: false
          }
        });
        
        return NextResponse.json({
          success: true,
          activeSession: null
        });
      }
      
      return NextResponse.json({
        success: true,
        activeSession: {
          participantId: activeParticipation.id,
          gameId: activeParticipation.gameId,
          mode: activeParticipation.game.mode,
          status: activeParticipation.game.status,
          joinCode: activeParticipation.game.joinCode
        }
      });
    }
    
    // No active session
    return NextResponse.json({
      success: true,
      activeSession: null
    });
    
  } catch (error) {
    console.error('Error checking active multiplayer sessions:', error);
    return NextResponse.json({ error: 'Failed to check active sessions' }, { status: 500 });
  }
} 