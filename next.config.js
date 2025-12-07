/** @type {import('next').NextConfig} */
const nextConfig = {
  /* 
     SMART CONFIGURATION:
     - Mobile (GitHub Actions) -> uses 'export' (Static)
     - Web (Firebase) -> uses undefined (Dynamic Server)
  */
  output: process.env.GITHUB_ACTIONS ? 'export' : undefined,

  typescript: {
    ignoreBuilderErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for mobile apps
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '2mb',
  },
};

module.exports = nextConfig;