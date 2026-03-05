// ============================================================
// The Edit — Next.js Config
// ============================================================

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Allow images from Sanity CDN
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },

  // Strict mode catches extra bugs during development
  reactStrictMode: true,
}

export default nextConfig
