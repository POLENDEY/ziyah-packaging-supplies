import type { MetadataRoute } from "next";
import { CATEGORY_LANDINGS } from "@/data/categories";
import { getProductImageUrls, type Product } from "@/data/products";
import { SITE_ORIGIN, SITE_SITELINKS, getSiteOrigin } from "@/data/site";
import { getPublishedProducts } from "@/lib/catalog/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteOrigin() || SITE_ORIGIN;
  const lastModified = new Date();
  let products: Product[] = [];
  try {
    products = await getPublishedProducts();
  } catch {
    products = [];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/quote", priority: 0.85, changeFrequency: "monthly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_LANDINGS.map((c) => ({
    url: `${siteUrl}/products/${c.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.88,
  }));

  const sitelinkExtras: MetadataRoute.Sitemap = SITE_SITELINKS.filter(
    (link) =>
      !link.path.includes("?") &&
      !staticRoutes.some((r) => r.url === `${siteUrl}${link.path}`) &&
      !categoryRoutes.some((r) => r.url === `${siteUrl}${link.path}`)
  ).map((link) => ({
    url: `${siteUrl}${link.path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: getProductImageUrls(product),
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...sitelinkExtras,
    ...productRoutes,
  ];
}
