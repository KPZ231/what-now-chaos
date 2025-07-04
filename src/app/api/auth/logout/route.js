import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
  // Create a response
  const response = NextResponse.json(
    { message: 'Wylogowano pomyślnie' },
    { status: 200 }
  )

  // Remove the auth token cookie
  response.cookies.set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Immediately expire the cookie
    path: '/',
  })

  return response
} 