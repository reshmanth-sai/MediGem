import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname, "./"),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
