/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: "export", // Replace "next export" cmd in [package.json]
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  // Set base path. This is the slug of your GitHub repository.
  basePath: "/web-portal",
  // Disable server-based image optimization. Next.js does not support dynamic features with static exports.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
