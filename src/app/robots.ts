import type { MetadataRoute } from "next";
import { SITE_ORIGIN, getSiteOrigin } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteOrigin() || SITE_ORIGIN;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ziyah-admin/", "/admin/", "/api/"],
      },
      {
        // Explicitly welcome Google Image indexing of product photos
        userAgent: "Googlebot-Image",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
