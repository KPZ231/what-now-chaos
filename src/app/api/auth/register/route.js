import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

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
    const { email, password, name } = await request.json()

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email)?.trim().toLowerCase();
    const sanitizedName = name ? sanitizeInput(name)?.trim() : null;
    
    // Enhanced validation
    if (!sanitizedEmail || !password) {
      return NextResponse.json(
        { error: 'Email i hasło są wymagane' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Podany adres email jest nieprawidłowy' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Hasło musi mieć co najmniej 6 znaków' },
        { status: 400 }
      )
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: sanitizedEmail }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Użytkownik z tym adresem email już istnieje' },
          { status: 409 }
        )
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password)

      // Create user with sanitized inputs
      const user = await prisma.user.create({
        data: {
          email: sanitizedEmail,
          password: hashedPassword,
          name: sanitizedName
        }
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Błąd bazy danych podczas rejestracji' },
        { status: 500 }
      )
    }

    // Return success without user data for security
    return NextResponse.json(
      { 
        message: 'Rejestracja zakończona pomyślnie',
        success: true
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