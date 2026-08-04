import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteOrigin();
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
