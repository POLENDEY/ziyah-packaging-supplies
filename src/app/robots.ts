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
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
