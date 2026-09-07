import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { SITE_ORIGIN, SITE_SITELINKS, getSiteOrigin } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Always emit the public custom domain (www), not a preview host
  const siteUrl = getSiteOrigin() || SITE_ORIGIN;
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/quote", priority: 0.8, changeFrequency: "monthly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const sitelinkRoutes: MetadataRoute.Sitemap = SITE_SITELINKS.filter((link) =>
    link.path.includes("?")
  ).map((link) => ({
    url: `${siteUrl}${link.path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...sitelinkRoutes, ...productRoutes];
}
