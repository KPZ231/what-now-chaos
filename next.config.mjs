/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs', 'jsonwebtoken'],
  eslint: {
    // Disable ESLint during production builds for better performance
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
