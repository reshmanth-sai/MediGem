import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// The product page is public. The workstation routes show synthetic
// patients and are not meant to be found through search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/workstation", "/history", "/assessments", "/transfers", "/assistant", "/new-case", "/results", "/settings", "/learning", "/demo", "/developer", "/evaluation", "/presentation", "/api"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
