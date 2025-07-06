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
  '/play/multiplayer/join',
  '/api/multiplayer/join',
  '/api/multiplayer/create',
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

// Check if the path is a multiplayer path that requires participant validation
const isMultiplayerPath = (path) => {
  return path.startsWith('/play/multiplayer/') ||
         path.startsWith('/api/multiplayer/game/');
}

export function middleware(request) {
  const path = request.nextUrl.pathname
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'); // Enforce HTTPS
  response.headers.set('X-Content-Type-Options', 'nosniff'); // Prevent MIME type sniffing
  response.headers.set('X-Frame-Options', 'DENY'); // Prevent clickjacking
  response.headers.set('X-XSS-Protection', '1; mode=block'); // Basic XSS protection
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); // Control referrer info
  response.headers.set('Content-Security-Policy', "default-src 'self'; connect-src 'self' https://whatnow-kapieksperimental-2f90.c.aivencloud.com:15657; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
  
  // Allow public paths
  if (isPublicPath(path)) {
    return response;
  }
  
  // Special handling for multiplayer paths - need to check for participantId
  if (isMultiplayerPath(path)) {
    // For API endpoints, we'll validate in the route handlers
    if (path.startsWith('/api/')) {
      return response;
    }
    
    // For page routes, check if participantId is in the URL
    const participantId = request.nextUrl.searchParams.get('participantId');
    if (participantId) {
      return response;
    }
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

  return response;
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
} 