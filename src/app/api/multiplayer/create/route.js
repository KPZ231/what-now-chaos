import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Generate a random 6-digit code
function generateGameCode() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

// Helper function to validate input
function validateInput(data) {
  if (!data.mode || !['soft', 'chaos', 'hardcore', 'quick'].includes(data.mode)) {
    return 'Invalid game mode';
  }
  
  if (!data.timerMinutes || data.timerMinutes < 1 || data.timerMinutes > 15) {
    return 'Timer minutes should be between 1 and 15';
  }
  
  if (!data.maxPlayers || data.maxPlayers < 2 || data.maxPlayers > 16) {
    return 'Max players should be between 2 and 16';
  }
  
  return null;
}

// Create a new multiplayer game
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Extract authentication token from cookies or headers
    const token = request.cookies.get('auth-token')?.value;
    
    // Validate game configuration
    const validationError = validateInput(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    
    // Check if user is authenticated
    let userId = null;
    let isRegistered = false;
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        userId = decoded.id;
        isRegistered = true;
      }
    }
    
    // For guests, validate nickname
    if (!isRegistered) {
      if (!data.nickname || data.nickname.length < 2) {
        return NextResponse.json({ error: 'Nickname is required and must be at least 2 characters' }, { status: 400 });
      }
    }
    
    // Generate a unique game code
    let joinCode = generateGameCode();
    let isCodeUnique = false;
    let attempts = 0;
    
    // Ensure the code is unique
    while (!isCodeUnique && attempts < 10) {
      const existingGame = await prisma.multiplayerGame.findUnique({
        where: { joinCode }
      });
      
      if (!existingGame) {
        isCodeUnique = true;
      } else {
        joinCode = generateGameCode();
        attempts++;
      }
    }
    
    if (!isCodeUnique) {
      return NextResponse.json({ error: 'Failed to generate a unique game code' }, { status: 500 });
    }
    
    // Create the game session
    const game = await prisma.multiplayerGame.create({
      data: {
        joinCode,
        mode: data.mode,
        timerMinutes: data.timerMinutes,
        maxPlayers: data.maxPlayers,
        hostId: userId, // If guest, this will be null
      }
    });
    
    // Add the creator as the first participant
    const participant = await prisma.multiplayerParticipant.create({
      data: {
        nickname: isRegistered ? data.nickname || 'Host' : data.nickname,
        isRegistered,
        isReady: true, // Host is automatically ready
        gameId: game.id,
        userId,
        turnOrder: 0, // Host is first in turn order
      }
    });
    
    // Update the game with the host as current turn
    await prisma.multiplayerGame.update({
      where: { id: game.id },
      data: { currentTurn: participant.id }
    });
    
    return NextResponse.json({
      success: true,
      gameId: game.id,
      joinCode: game.joinCode,
      participantId: participant.id
    });
    
  } catch (error) {
    console.error('Error creating multiplayer game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
} 