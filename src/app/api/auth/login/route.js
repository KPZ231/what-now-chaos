import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email i hasło są wymagane' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // User not found or password doesn't match
    if (!user) {
      return NextResponse.json(
        { error: 'Nieprawidłowy email lub hasło' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Nieprawidłowy email lub hasło' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken(user)

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user

    // Set cookie with the token
    const response = NextResponse.json(
      { 
        message: 'Logowanie zakończone pomyślnie',
        user: userWithoutPassword
      },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas logowania' },
      { status: 500 }
    )
  }
} 