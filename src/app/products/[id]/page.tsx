import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildInquireHref,
  getProductById,
  products,
} from "@/data/products";
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

  return {
    title: `${product.name} | Buy Food Packaging Philippines`,
    description: product.desc,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.name} | Ziyah Packaging Supplies`,
      description: product.longDesc,
      images: [{ url: product.images[0], alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDesc,
    image: product.images,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "Ziyah Packaging Supplies",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "PHP",
      price: product.price.replace(/[^\d.]/g, "") || undefined,
      availability: "https://schema.org/InStock",
      url: `/products/${product.id}`,
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
          <ProductGallery images={product.images} name={product.name} />

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
