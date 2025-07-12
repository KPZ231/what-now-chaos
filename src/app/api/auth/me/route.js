import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(request) {
  console.log('GET /api/auth/me endpoint called');
  
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value
    
    console.log('Auth token present:', !!token);
    if (token) {
      console.log('Token length:', token.length);
    }

    if (!token) {
      console.log('No auth token found in cookies');
      return NextResponse.json({ error: 'Unauthorized', message: 'No auth token found' }, { status: 401 })
    }

    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      console.log('Invalid or expired token');
      return NextResponse.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, { status: 401 })
    }

    console.log('Token verified for user ID:', decoded.id);

    // Get user from database with premium fields
    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          description: true,
          profilePicture: true,
          isPremium: true,
          hasPremium: true,
          premiumPlan: true,
          premiumExpiry: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!user) {
        console.log('User not found in database:', decoded.id);
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      console.log('User found and returning data for:', user.id);
      return NextResponse.json({ user }, { status: 200 })
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', message: dbError.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching user data', message: error.message },
      { status: 500 }
    )
  }
} 