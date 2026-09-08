import Link from "next/link";
import { Suspense } from "react";
import type { CategoryLanding } from "@/data/categories";
import { absoluteAssetUrl, getProductImageAlt, products } from "@/data/products";
import { SITE, getSiteOrigin } from "@/data/site";
import ProductsClient from "./ProductsClient";
import styles from "./page.module.css";

type Props = {
  landing: CategoryLanding;
};

export default function CategoryLandingView({ landing }: Props) {
  const origin = getSiteOrigin();
  const categoryProducts = products.filter((p) => p.category === landing.category);
  const pageUrl = `${origin}/products/${landing.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: origin,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${origin}/products`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: landing.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        name: landing.title,
        description: landing.description,
        url: pageUrl,
        isPartOf: { "@type": "WebSite", name: SITE.name, url: origin },
        about: landing.category,
        mainEntity: {
          "@type": "ItemList",
          name: landing.name,
          numberOfItems: categoryProducts.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: categoryProducts.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteAssetUrl(`/products/${product.id}`),
            name: product.name,
            item: {
              "@type": "Product",
              name: product.name,
              description: product.desc,
              image: product.images.map((src) => absoluteAssetUrl(src)),
              category: product.category,
              brand: { "@type": "Brand", name: SITE.name },
              url: absoluteAssetUrl(`/products/${product.id}`),
            },
          })),
        },
        primaryImageOfPage: categoryProducts[0]
          ? {
              "@type": "ImageObject",
              url: absoluteAssetUrl(categoryProducts[0].images[0]),
              name: getProductImageAlt(
                categoryProducts[0].name,
                categoryProducts[0].images[0],
                0,
                {
                  category: categoryProducts[0].category,
                  color: categoryProducts[0].color,
                  dimensions: categoryProducts[0].dimensions,
                }
              ),
            }
          : undefined,
      },
    ],
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <nav className={styles.categoryCrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/products">Products</Link>
            <span aria-hidden="true">/</span>
            <span>{landing.name}</span>
          </nav>
          <h1>{landing.h1}</h1>
          <p>{landing.intro}</p>
          <p className={styles.categoryCount}>
            {categoryProducts.length} product
            {categoryProducts.length === 1 ? "" : "s"} in this collection ·{" "}
            <Link href="/products">View all packaging</Link>
          </p>
        </div>
      </header>
      <Suspense fallback={<div className={styles.container}>Loading products…</div>}>
        <ProductsClient initialCategory={landing.category} lockCategory />
      </Suspense>
    </main>
  );
}
