import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "./page.module.css";
import ProductsClient from "./ProductsClient";
import { absoluteAssetUrl, getProductImageAlt } from "@/data/products";
import { getSiteOrigin, SITE } from "@/data/site";
import {
  getCategories,
  getPublishedProducts,
} from "@/lib/catalog/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop Food Packaging | Bento Boxes & Sushi Trays PH",
  description:
    "Shop food packaging in the Philippines: clear and black hard bento boxes, red-and-black meal bentos, round and rectangular sushi trays. Wholesale pricing from Pasay City with nationwide delivery.",
  keywords: [
    ...SITE.seoKeywords,
    "hard bento clear",
    "hard bento black",
    "rectangular sushi tray",
    "round sushi tray with lid",
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Food Packaging Products for Sale | Ziyah Packaging Supplies",
    description:
      "Browse bento boxes and sushi trays with pack and box wholesale rates. Serving food businesses nationwide from Pasay City.",
    images: [{ url: "/logo-512.png", alt: SITE.name }],
    url: "/products",
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Packaging Products | Ziyah Packaging Supplies",
    description:
      "Bento boxes, sushi trays, and wholesale takeout packaging — buy online in the Philippines.",
    images: ["/logo-512.png"],
  },
};

export default async function ProductsPage() {
  const [products, dbCategories] = await Promise.all([
    getPublishedProducts(),
    getCategories(),
  ]);
  const categories = dbCategories.map((c) => c.name);
  const origin = getSiteOrigin();
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Food Packaging Products | Ziyah Packaging Supplies",
    description:
      "Official catalog of bento boxes and sushi trays for restaurants and home businesses in the Philippines.",
    url: `${origin}/products`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: origin },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteAssetUrl(`/products/${product.id}`),
        name: product.name,
        item: {
          "@type": "Product",
          "@id": `${absoluteAssetUrl(`/products/${product.id}`)}#product`,
          name: product.name,
          description: product.desc,
          category: product.category,
          image: product.images.map((src) => absoluteAssetUrl(src)),
          brand: { "@type": "Brand", name: SITE.name },
          url: absoluteAssetUrl(`/products/${product.id}`),
        },
      })),
    },
  };

  const imageGalleryJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${SITE.name} product photo catalog`,
    description:
      "Product photos of food-grade bento boxes and sushi trays sold by Ziyah Packaging Supplies in the Philippines.",
    url: `${origin}/products`,
    associatedMedia: products.flatMap((product) =>
      product.images.map((src, i) => ({
        "@type": "ImageObject",
        contentUrl: absoluteAssetUrl(src),
        url: absoluteAssetUrl(src),
        name: getProductImageAlt(product.name, src, i, {
          category: product.category,
          color: product.color,
          dimensions: product.dimensions,
        }),
        caption: `${product.name} — ${product.desc}`,
        representativeOfPage: i === 0,
      }))
    ),
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGalleryJsonLd) }}
      />
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Buy Food Packaging Products in the Philippines</h1>
          <p>
            Hard bento boxes, everyday meal bentos, and sushi trays with lids — food-grade
            packaging for takeout, catering, and meal prep. Official wholesale pricing for
            restaurants and home businesses, with pickup in Pasay City or delivery nationwide.
          </p>
        </div>
      </header>
      <Suspense fallback={<div className={styles.container}>Loading products…</div>}>
        <ProductsClient products={products} categories={categories} />
      </Suspense>
    </main>
  );
}
