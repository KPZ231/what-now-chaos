import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Store failed attempts to prevent brute force
const failedAttempts = new Map();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

// Rate limiting logic
function checkRateLimit(ip) {
  const now = Date.now();
  
  // Clean up old entries
  for (const [key, data] of failedAttempts.entries()) {
    if (now - data.timestamp > BLOCK_DURATION) {
      failedAttempts.delete(key);
    }
  }
  
  // Check if IP is blocked
  const attempts = failedAttempts.get(ip);
  if (attempts && attempts.count >= MAX_ATTEMPTS && now - attempts.timestamp < BLOCK_DURATION) {
    const remaining = Math.ceil((attempts.timestamp + BLOCK_DURATION - now) / 60000);
    return `Too many failed attempts. Try again in ${remaining} minutes`;
  }
  
  return null;
}

// Record failed attempt
function recordFailedAttempt(ip) {
  const now = Date.now();
  const attempts = failedAttempts.get(ip) || { count: 0, timestamp: now };
  
  attempts.count += 1;
  attempts.timestamp = now;
  
  failedAttempts.set(ip, attempts);
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Check rate limit
    const rateLimitError = checkRateLimit(ip);
    if (rateLimitError) {
      return NextResponse.json({ error: rateLimitError }, { status: 429 });
    }
    
    const data = await request.json();
    
    // Extract authentication token from cookies or headers
    const token = request.cookies.get('auth-token')?.value;
    
    // Validate input
    if (!data.joinCode || data.joinCode.length !== 6) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid join code' }, { status: 400 });
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
    
    // Find the game by join code
    const game = await prisma.multiplayerGame.findUnique({
      where: { joinCode: data.joinCode },
      include: {
        participants: true
      }
    });
    
    if (!game) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    // Check if game is in valid state
    if (game.status !== 'lobby') {
      return NextResponse.json({ error: 'Game has already started' }, { status: 400 });
    }
    
    // Check if game is full
    if (game.participants.length >= game.maxPlayers) {
      return NextResponse.json({ error: 'Game is full' }, { status: 400 });
    }
    
    // Check if user is already in this game
    if (isRegistered && userId) {
      const existingParticipant = game.participants.find(p => p.userId === userId);
      if (existingParticipant) {
        // If user is already in the game, return their participant info
        return NextResponse.json({
          success: true,
          gameId: game.id,
          joinCode: game.joinCode,
          participantId: existingParticipant.id,
          alreadyJoined: true
        });
      }
    }
    
    // Add the user as a participant
    const nextTurnOrder = game.participants.length;
    const participant = await prisma.multiplayerParticipant.create({
      data: {
        nickname: data.nickname || 'Guest',
        isRegistered,
        isReady: false,
        gameId: game.id,
        userId,
        turnOrder: nextTurnOrder,
      }
    });
    
    return NextResponse.json({
      success: true,
      gameId: game.id,
      joinCode: game.joinCode,
      participantId: participant.id
    });
    
  } catch (error) {
    console.error('Error joining multiplayer game:', error);
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
} 