import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET handler to fetch premium task packages
export async function GET(request) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Check if user has premium access
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
    });
    
    if (!userProfile || !userProfile.hasPremium) {
      return NextResponse.json({ error: 'Premium account required' }, { status: 403 });
    }
    
    // Get premium task sets
    // This includes:
    // 1. Task sets marked as premium and public
    // 2. Custom task sets created by the user
    const premiumTaskSets = await prisma.taskSet.findMany({
      where: {
        isPremium: true,
        OR: [
          { isPublic: true },
          { creatorId: user.id }
        ]
      },
      include: {
        tasks: true,
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        }
      },
      orderBy: [
        { isPublic: 'desc' }, // Public sets first
        { updatedAt: 'desc' }  // Then most recent
      ]
    });
    
    // Organize task sets by mode
    const organizedTaskSets = {
      soft: premiumTaskSets.filter(set => set.mode === 'soft'),
      chaos: premiumTaskSets.filter(set => set.mode === 'chaos'),
      hardcore: premiumTaskSets.filter(set => set.mode === 'hardcore'),
      quick: premiumTaskSets.filter(set => set.mode === 'quick'),
      custom: premiumTaskSets.filter(set => set.creatorId === user.id)
    };
    
    return NextResponse.json({ taskSets: organizedTaskSets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching premium task packages:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 