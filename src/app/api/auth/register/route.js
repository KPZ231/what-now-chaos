import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email i hasło są wymagane' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Użytkownik z tym adresem email już istnieje' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    })

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'Rejestracja zakończona pomyślnie',
        user: userWithoutPassword
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    )
  }
} 