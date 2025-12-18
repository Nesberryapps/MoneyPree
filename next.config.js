/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
   /* 
     This is now a standard server build for Firebase App Hosting.
     Mobile builds will use a command-line flag to create a static export.
  */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for mobile apps and static exports
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
  };

module.exports = nextConfig;
