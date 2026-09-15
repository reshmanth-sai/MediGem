import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";


// The product page is public. The workstation routes show synthetic
// patients and are not meant to be found through search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/workstation", "/history", "/assessments", "/transfers", "/assistant", "/new-case", "/results", "/settings", "/learning", "/developer", "/evaluation", "/api"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
