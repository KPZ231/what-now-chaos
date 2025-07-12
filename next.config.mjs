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
  
  // Security Headers
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://whatnow-kapieksperimental-2f90.c.aivencloud.com:15657 https://api.stripe.com; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; frame-src 'self' https://js.stripe.com https://hooks.stripe.com;",
          }
        ],
      },
    ];
  },
};

export default nextConfig;
