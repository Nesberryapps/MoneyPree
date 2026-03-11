/** @type {import('next').NextConfig} */

const nextConfig = {
  // 1. Keep these to prevent build fails on small errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2. Image settings
  images: {
    remotePatterns: [
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
  
  // 3. Add webpack configuration to handle server-side modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve server-only modules on the client
      config.resolve.fallback = {
        fs: false,
        dns: false,
        async_hooks: false,
        perf_hooks: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
