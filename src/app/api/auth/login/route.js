import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export const runtime = 'nodejs'

// Utility function for input sanitization
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  // Remove potentially harmful characters
  return input.replace(/['";\\]/g, '');
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    console.log('Login endpoint called');
    
    // Check if JWT_TOKEN is defined
    if (!process.env.JWT_TOKEN) {
      console.error('JWT_TOKEN environment variable is not defined');
      return NextResponse.json(
        { error: 'Błąd konfiguracji serwera' },
        { status: 500 }
      );
    }
    
    let body;
    try {
      body = await request.json();
      console.log('Received login request for email:', body.email);
    } catch (err) {
      console.error('Failed to parse request body:', err);
      return NextResponse.json(
        { error: 'Nieprawidłowe dane żądania' },
        { status: 400 }
      );
    }
    
    const { email, password } = body;

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email)?.trim().toLowerCase();
    
    // Enhanced validation
    if (!sanitizedEmail || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email i hasło są wymagane' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!emailRegex.test(sanitizedEmail)) {
      console.log('Invalid email format');
      return NextResponse.json(
        { error: 'Podany adres email jest nieprawidłowy' },
        { status: 400 }
      )
    }

    // Find user with sanitized email
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: sanitizedEmail }
      });
      
      if (!user) {
        console.log('User not found:', sanitizedEmail);
        return NextResponse.json(
          { error: 'Nieprawidłowy email lub hasło' },
          { status: 401 }
        );
      }
      
      console.log('User found:', user.id);
    } catch (dbError) {
      console.error('Database error finding user:', dbError);
      return NextResponse.json(
        { error: 'Błąd bazy danych' },
        { status: 500 }
      );
    }

    // Verify password
    try {
      const isPasswordValid = await verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        console.log('Invalid password for user:', user.id);
        return NextResponse.json(
          { error: 'Nieprawidłowy email lub hasło' },
          { status: 401 }
        );
      }
      
      console.log('Password verified for user:', user.id);
    } catch (pwError) {
      console.error('Password verification error:', pwError);
      return NextResponse.json(
        { error: 'Błąd weryfikacji hasła' },
        { status: 500 }
      );
    }

    // Generate JWT token
    let token;
    try {
      token = generateToken(user);
      console.log('Token generated successfully for user:', user.id);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return NextResponse.json(
        { error: 'Błąd generowania tokenu uwierzytelniającego' },
        { status: 500 }
      );
    }

    // Get updated user data with premium fields
    let userData;
    try {
      userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        description: user.description,
        profilePicture: user.profilePicture,
        isPremium: user.isPremium,
        hasPremium: user.hasPremium,
        premiumPlan: user.premiumPlan,
        premiumExpiry: user.premiumExpiry,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      console.log('User data retrieved:', userData.id);
    } catch (dataError) {
      console.error('Error retrieving user data:', dataError);
      return NextResponse.json(
        { error: 'Błąd pobierania danych użytkownika' },
        { status: 500 }
      );
    }

    // Set cookie with the token
    try {
      const response = NextResponse.json(
        { 
          message: 'Logowanie zakończone pomyślnie',
          user: userData
        },
        { status: 200 }
      );

      // Set cookie with fixed settings for development environment
      response.cookies.set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'lax', // Changed from 'strict' to 'lax' to allow cookies in redirects
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
      
      // Debug cookie setting
      console.log('Setting auth cookie with token:', token.substring(0, 20) + '...');
      console.log('Cookie secure setting:', process.env.NODE_ENV === 'production');
      console.log('Cookie sameSite setting:', 'lax');
      
      return response;
    } catch (cookieError) {
      console.error('Error setting cookie:', cookieError);
      return NextResponse.json(
        { error: 'Błąd ustawiania ciasteczka uwierzytelniającego' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: `Wystąpił błąd podczas logowania: ${error.message}` },
      { status: 500 }
    );
  }
} 