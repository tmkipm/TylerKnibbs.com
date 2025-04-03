import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning instead of error for production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Do the same for TypeScript errors
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
