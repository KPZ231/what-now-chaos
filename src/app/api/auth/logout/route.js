import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
  console.log('Logout endpoint called');
  
  // Create a response
  const response = NextResponse.json(
    { message: 'Wylogowano pomyślnie' },
    { status: 200 }
  )

  // Remove the auth token cookie with matching settings
  response.cookies.set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Match the login route setting
    maxAge: 0, // Immediately expire the cookie
    path: '/',
  })
  
  console.log('Auth cookie cleared');

  return response
} 