import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

