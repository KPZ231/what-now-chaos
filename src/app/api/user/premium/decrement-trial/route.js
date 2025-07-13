import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    // Get user session
    const session = await getSession(request);

    // Check if user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // User already has premium, no need to decrement trial
    if (user.hasPremium) {
      return NextResponse.json(
        { message: 'User has premium, no trial to decrement' },
        { status: 200 }
      );
    }

    // Check if user has free trials left
    if (user.freeTrialGamesLeft <= 0) {
      return NextResponse.json(
        { message: 'No free trials left to decrement' },
        { status: 200 }
      );
    }

    // Decrement free trial count
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        freeTrialGamesLeft: Math.max(0, user.freeTrialGamesLeft - 1)
      }
    });

    return NextResponse.json(
      {
        success: true,
        freeTrialGamesLeft: updatedUser.freeTrialGamesLeft
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error decrementing free trial:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji darmowych gier' },
      { status: 500 }
    );
  }
} 