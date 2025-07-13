/** @type {import('next').NextConfig} */

const nextConfig = {
  // Define environment variables that will be publicly available
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  
  // Other Next.js configuration
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  // PWA configuration
  pwa: {
    dest: 'public',
    register: false, // We handle registration in service-worker-register.js
    skipWaiting: true,
  },
  
  // Security Headers (synchronized with middleware.js)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://whatnow-kapieksperimental-2f90.c.aivencloud.com:15657 https://api.stripe.com; img-src 'self' data: https://pagead2.googlesyndication.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googletagservices.com https://adservice.google.com https://tpc.googlesyndication.com; style-src 'self' 'unsafe-inline'; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://googleads.g.doubleclick.net; worker-src 'self' blob:; manifest-src 'self';",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-site',
          }
        ],
      },
    ];
  },
};

export default nextConfig;
