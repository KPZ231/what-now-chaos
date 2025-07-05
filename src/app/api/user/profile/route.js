import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify token and get user data
    const userData = verifyToken(token);
    
    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Get user from database (excluding password)
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: {
        id: true,
        email: true,
        name: true,
        description: true,
        profilePicture: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify token and get user data
    const userData = verifyToken(token);
    
    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Parse the request body
    const data = await request.json();
    
    // Validate the data
    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Update only allowed fields
    const updateData = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    
    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        description: true,
        profilePicture: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 