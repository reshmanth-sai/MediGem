import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // A verification build (CI, or an agent checking its work) can point at
  // its own directory so it never clobbers the cache a running `next dev`
  // is serving from: NEXT_DIST_DIR=.next-verify npm run build
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
