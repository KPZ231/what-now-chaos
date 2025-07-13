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
  '/api/auth/logout',
  '/api/auth/me', // Add /api/auth/me to public paths
  '/api/auth/reset-password/request',
  '/api/auth/reset-password/confirm',
  '/play',
  '/play/multiplayer/join',
  '/api/multiplayer/join',
  '/api/multiplayer/create',
  '/api/multiplayer/active-sessions', // Added this path
  '/premium',
  '/modes',
  '/offline.html',
  '/manifest.json',
  '/service-worker.js',
  '/service-worker-register.js',
  '/favicon.png',
  '/robots.txt',
  '/sitemap.xml'
]

// Check if the path matches a public path
const isPublicPath = (path) => {
  return publicPaths.some(publicPath => {
    return path === publicPath || path.startsWith(`${publicPath}/`) ||
      (publicPath.includes('*') && path.startsWith(publicPath.replace('*', '')))
  })
}

// Check if the path is a PWA asset (should be public)
const isPWAAsset = (path) => {
  return path.startsWith('/icons/') || 
         path.startsWith('/screenshots/') ||
         path.startsWith('/sounds/') ||
         path.startsWith('/data/') || 
         path.includes('.svg') ||
         path.includes('.png') ||
         path.includes('.jpg') ||
         path.includes('.jpeg') ||
         path.includes('.mp3');
}

// Check if the path is a multiplayer path that requires participant validation
const isMultiplayerPath = (path) => {
  return path.startsWith('/play/multiplayer/') ||
         path.startsWith('/api/multiplayer/game/');
}

export function middleware(request) {
  const path = request.nextUrl.pathname
  console.log('Middleware processing path:', path);
  
  const response = NextResponse.next();

  // Add security headers to all responses (synchronized with next.config.mjs)
  const securityHeaders = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload', // 2 years
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; connect-src 'self' https://whatnow-kapieksperimental-2f90.c.aivencloud.com:15657 https://api.stripe.com; img-src 'self' data: https://pagead2.googlesyndication.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googletagservices.com https://adservice.google.com https://tpc.googlesyndication.com; style-src 'self' 'unsafe-inline'; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://googleads.g.doubleclick.net; worker-src 'self' blob:; manifest-src 'self';",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-site'
  };
  
  // Apply all security headers
  Object.keys(securityHeaders).forEach(key => {
    response.headers.set(key, securityHeaders[key]);
  });
  
  // Allow public paths and PWA assets
  if (isPublicPath(path) || isPWAAsset(path)) {
    console.log('Public path detected, allowing access:', path);
    return response;
  }
  
  // Special handling for multiplayer paths - need to check for participantId
  if (isMultiplayerPath(path)) {
    // For API endpoints, we'll validate in the route handlers
    if (path.startsWith('/api/')) {
      console.log('API multiplayer path, allowing access:', path);
      return response;
    }
    
    // For page routes, check if participantId is in the URL
    const participantId = request.nextUrl.searchParams.get('participantId');
    if (participantId) {
      console.log('Multiplayer path with participantId, allowing access:', path);
      return response;
    }
  }

  // Check for auth token
  const token = request.cookies.get('auth-token')?.value || ''
  console.log('Auth token exists:', !!token);
  
  if (token) {
    console.log('Token found, length:', token.length);
  }

  // Validate token
  const user = token ? verifyToken(token) : null
  console.log('Token verification result:', user ? 'Valid user token' : 'Invalid or missing token');

  // If not authenticated, redirect to login
  if (!user && !isPublicPath(path)) {
    console.log('Authentication required, redirecting to login:', path);
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // For certain premium paths, check if the user is premium
  if (path.startsWith('/premium') && (!user || !user.isPremium)) {
    console.log('Premium access required, redirecting:', path);
    return NextResponse.redirect(new URL('/premium-required', request.url))
  }

  return response;
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.png|.*\\.svg).*)',
  ],
} 