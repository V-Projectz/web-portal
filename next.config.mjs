const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  basePath: isProd ? "/web-portal" : "",
  assetPrefix: isProd ? "/web-portal/" : "",
  images: {
    unoptimized: true,
  },
  output: "export", // Very important for GitHub Pages
};

export default nextConfig;
