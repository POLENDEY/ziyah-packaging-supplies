import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { getSiteOrigin } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteOrigin();
  // Stable-ish date for crawlers (rebuild refreshes)
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/quote", priority: 0.7, changeFrequency: "monthly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
