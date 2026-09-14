/**
 * Absolute origin for metadata (Open Graph image, sitemap, canonical).
 * NEXT_PUBLIC_SITE_URL wins; on Vercel the production URL is used
 * automatically; locally it is the dev server.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000";
