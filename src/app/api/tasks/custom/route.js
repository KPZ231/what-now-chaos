import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET handler to fetch user's custom task sets
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
    
    // Get custom task sets created by the user
    const taskSets = await prisma.taskSet.findMany({
      where: {
        creatorId: user.id
      },
      include: {
        tasks: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return NextResponse.json({ taskSets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching custom task sets:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST handler to create a new custom task set
export async function POST(request) {
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
    
    // Get request data
    const data = await request.json();
    const { name, description, mode, tasks, isPublic = false } = data;
    
    // Validate request data
    if (!name || !mode || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, mode, and at least one task'
      }, { status: 400 });
    }
    
    // Limit number of custom task sets per user (e.g., 10)
    const userTaskSetsCount = await prisma.taskSet.count({
      where: { creatorId: user.id }
    });
    
    if (userTaskSetsCount >= 10) {
      return NextResponse.json({ 
        error: 'Maximum number of custom task sets reached (10). Delete some to create new ones.'
      }, { status: 400 });
    }
    
    // Create new task set with tasks
    const newTaskSet = await prisma.taskSet.create({
      data: {
        name,
        description: description || '',
        mode,
        isPremium: true,
        isPublic,
        creator: {
          connect: { id: user.id }
        },
        tasks: {
          create: tasks.map(task => ({
            content: task
          }))
        }
      },
      include: {
        tasks: true
      }
    });
    
    return NextResponse.json({ 
      message: 'Task set created successfully',
      taskSet: newTaskSet
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating custom task set:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 