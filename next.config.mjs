/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable Node.js for middleware and API routes
    serverComponentsExternalPackages: ['bcryptjs', 'jsonwebtoken'],
  },
  // Ensure middleware runs in Node.js runtime
  middleware: {
    runtime: 'nodejs',
  },
};

export default nextConfig;
