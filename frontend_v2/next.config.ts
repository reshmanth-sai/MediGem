import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname, "./"),
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // The product page is the root; the old marketing path and the two
      // index aliases redirect rather than shipping as routes.
      { source: "/landing", destination: "/", permanent: true },
      { source: "/referrals", destination: "/transfers", permanent: false },
      { source: "/results", destination: "/assessments", permanent: false },
    ];
  },
};

export default nextConfig;
