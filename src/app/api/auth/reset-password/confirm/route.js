import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Parse request body
    const { token, password } = await request.json();
    
    // Validate input
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password and clear the reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetTokenExpiry: null,
      }
    });

    return NextResponse.json({ 
      message: 'Password has been reset successfully' 
    });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 