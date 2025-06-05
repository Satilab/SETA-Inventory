/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Remove output: 'export' for Vercel deployment
  // output: 'export', // This causes issues with API routes on Vercel
  
  images: {
    domains: ['placeholder.svg'],
    unoptimized: false, // Let Vercel handle image optimization
  },
  
  // Ensure API routes work properly
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
