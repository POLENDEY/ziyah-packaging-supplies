import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "./page.module.css";
import ProductsClient from "./ProductsClient";
import { absoluteAssetUrl, products } from "@/data/products";
import { getSiteOrigin, SITE } from "@/data/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Buy Food Packaging Products | Bento Boxes & Sushi Trays PH",
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
    images: [{ url: "/logo.png", alt: SITE.name }],
    url: "/products",
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Packaging Products | Ziyah Packaging Supplies",
    description:
      "Bento boxes, sushi trays, and wholesale takeout packaging — buy online in the Philippines.",
    images: ["/logo.png"],
  },
};

export default function ProductsPage() {
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
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteAssetUrl(`/products/${product.id}`),
        name: product.name,
      })),
    },
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
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
        <ProductsClient />
      </Suspense>
    </main>
  );
}
