import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET handler to fetch a specific task set
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Get the task set
    const taskSet = await prisma.taskSet.findUnique({
      where: { id },
      include: {
        tasks: true,
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        }
      }
    });
    
    if (!taskSet) {
      return NextResponse.json({ error: 'Task set not found' }, { status: 404 });
    }
    
    // Check if user has access to this task set
    if (taskSet.creatorId !== user.id) {
      // If not the creator, check if it's public and the user has premium
      if (!taskSet.isPublic) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
      });
      
      if (!userProfile || !userProfile.hasPremium) {
        return NextResponse.json({ error: 'Premium account required' }, { status: 403 });
      }
    }
    
    return NextResponse.json({ taskSet }, { status: 200 });
  } catch (error) {
    console.error('Error fetching task set:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT handler to update a task set
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Check if task set exists and belongs to the user
    const existingTaskSet = await prisma.taskSet.findUnique({
      where: { id },
      include: { tasks: true }
    });
    
    if (!existingTaskSet) {
      return NextResponse.json({ error: 'Task set not found' }, { status: 404 });
    }
    
    if (existingTaskSet.creatorId !== user.id) {
      return NextResponse.json({ error: 'You can only update your own task sets' }, { status: 403 });
    }
    
    // Get update data
    const data = await request.json();
    const { name, description, mode, tasks, isPublic } = data;
    
    // Validate request data
    if (!name || !mode || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, mode, and at least one task'
      }, { status: 400 });
    }
    
    // Delete existing tasks
    await prisma.task.deleteMany({
      where: { taskSetId: id }
    });
    
    // Update task set with new tasks
    const updatedTaskSet = await prisma.taskSet.update({
      where: { id },
      data: {
        name,
        description: description || '',
        mode,
        isPublic: isPublic || false,
        updatedAt: new Date(),
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
      message: 'Task set updated successfully',
      taskSet: updatedTaskSet
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating task set:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE handler to remove a task set
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Check if task set exists and belongs to the user
    const taskSet = await prisma.taskSet.findUnique({
      where: { id }
    });
    
    if (!taskSet) {
      return NextResponse.json({ error: 'Task set not found' }, { status: 404 });
    }
    
    if (taskSet.creatorId !== user.id) {
      return NextResponse.json({ error: 'You can only delete your own task sets' }, { status: 403 });
    }
    
    // Delete the task set (cascade will delete associated tasks)
    await prisma.taskSet.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Task set deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task set:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 