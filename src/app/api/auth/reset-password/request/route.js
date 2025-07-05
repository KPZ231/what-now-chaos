import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request) {
  try {
    // Parse request body
    const { email } = await request.json();
    
    // Validate email
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // We don't want to reveal if a user exists or not for security reasons
      return NextResponse.json({ 
        message: 'If your email is registered, you will receive instructions to reset your password' 
      });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour

    // Store token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    // In a real application, you would send an email here with the reset link
    // Example: const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // For demo purposes, we're just returning the token (in production, never expose this!)
    return NextResponse.json({
      message: 'If your email is registered, you will receive instructions to reset your password',
      // Include the token in the response ONLY FOR DEVELOPMENT
      // In production, you would never expose this
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 