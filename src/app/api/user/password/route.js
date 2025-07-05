import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

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
    if (!data || !data.currentPassword || !data.newPassword) {
      return NextResponse.json({ error: 'Both current and new passwords are required' }, { status: 400 });
    }

    // Validate new password length
    if (data.newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
    }

    // Get the user with password from database
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: {
        id: true,
        password: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.newPassword, salt);

    // Update the password in the database
    await prisma.user.update({
      where: { id: userData.id },
      data: {
        password: hashedPassword
      }
    });

    return NextResponse.json({ 
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 