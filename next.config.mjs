/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  images: {
    unoptimized: false, // Let Vercel handle image optimization
  },
};

export default nextConfig;
