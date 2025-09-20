import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{
        key: 'Strict-Transport-Security',
        value: 'max-age=315360000; includeSubDomains; preload',
      }],
    }];
  },
};

export default nextConfig;
