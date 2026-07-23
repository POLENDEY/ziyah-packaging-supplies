import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  absoluteAssetUrl,
  buildInquireHref,
  getProductById,
  getProductImageAlt,
  products,
} from "@/data/products";
import { SITE } from "@/data/site";
import ProductGallery from "./ProductGallery";
import styles from "./detail.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) {
    return { title: "Product Not Found" };
  }

  const primaryImage = product.images[0];
  const imageAlt = getProductImageAlt(product.name, primaryImage, 0);
  const absoluteImages = product.images.map((src, i) => ({
    url: absoluteAssetUrl(src),
    alt: getProductImageAlt(product.name, src, i),
  }));

  return {
    title: `${product.name} | Buy Food Packaging Philippines`,
    description: `${product.desc} Shop ${product.name} from ${SITE.name}. ${product.longDesc}`,
    keywords: [
      product.name,
      product.category,
      "Ziyah Packaging Supplies",
      "food packaging Philippines",
      "sushi tray",
      "wholesale packaging",
    ],
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${SITE.name}`,
      description: product.longDesc,
      images: absoluteImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE.name}`,
      description: product.desc,
      images: [absoluteAssetUrl(primaryImage)],
    },
    other: {
      "og:image:alt": imageAlt,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();

  const productUrl = absoluteAssetUrl(`/products/${product.id}`);
  const imageObjects = product.images.map((src, i) => ({
    "@type": "ImageObject",
    contentUrl: absoluteAssetUrl(src),
    url: absoluteAssetUrl(src),
    name: getProductImageAlt(product.name, src, i),
    description: getProductImageAlt(product.name, src, i),
    caption: getProductImageAlt(product.name, src, i),
    representativeOfPage: i === 0,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDesc,
    sku: `ZIYAH-${product.id}`,
    image: imageObjects,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    manufacturer: {
      "@type": "Organization",
      name: SITE.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "PHP",
      price: product.price.replace(/[^\d.]/g, "") || undefined,
      availability: "https://schema.org/InStock",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: SITE.name,
      },
    },
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.layout}>
          <ProductGallery
            images={product.images}
            name={product.name}
            video={product.video}
          />

          <div className={styles.content}>
            <p className={styles.category}>{product.category}</p>
            <h1>{product.name}</h1>
            <p className={styles.price}>
              {product.price}
              <span>{product.unit}</span>
            </p>
            <p className={styles.type}>{product.type}</p>
            <p className={styles.desc}>{product.longDesc}</p>

            <div className={styles.block}>
              <h2>Dimensions</h2>
              <p>{product.dimensions}</p>
            </div>

            <div className={styles.block}>
              <h2>Specifications</h2>
              <ul className={styles.specs}>
                {product.specs.map((spec) => (
                  <li key={spec.label}>
                    <strong>{spec.label}</strong>
                    <span>{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.actions}>
              <Link href={buildInquireHref(product)} className={styles.primary}>
                Inquire about this product
              </Link>
              <Link href="/products" className={styles.secondary}>
                Back to products
              </Link>
              <Link href="/quote" className={styles.secondary}>
                Request wholesale quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
