"use client";

import { NextResponse } from 'next/server'
import { verifyToken } from '../lib/auth'

export const runtime = 'nodejs'

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/reset-password',
  '/reset-password/',
  '/about',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/reset-password/request',
  '/api/auth/reset-password/confirm',
  '/play',
  '/premium',
  '/modes'
]

// Check if the path matches a public path
const isPublicPath = (path) => {
  return publicPaths.some(publicPath => {
    return path === publicPath || path.startsWith(`${publicPath}/`) ||
      (publicPath.includes('*') && path.startsWith(publicPath.replace('*', '')))
  })
}

export function middleware(request) {
  const path = request.nextUrl.pathname

  // Allow public paths
  if (isPublicPath(path)) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get('auth-token')?.value || ''

  // Validate token
  const user = token ? verifyToken(token) : null

  // If not authenticated, redirect to login
  if (!user && !isPublicPath(path)) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // For certain premium paths, check if the user is premium
  if (path.startsWith('/premium') && (!user || !user.isPremium)) {
    return NextResponse.redirect(new URL('/premium-required', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
} 