import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  absoluteAssetUrl,
  getColorVariants,
  getProductById,
  getProductFaqs,
  getProductImageAlt,
  getSiteOrigin,
  products,
} from "@/data/products";
import { SITE } from "@/data/site";
import ProductGallery from "./ProductGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductSeoSections from "./ProductSeoSections";
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
  const titleName = product.displayName || product.name;

  return {
    title: `${product.name} | Buy Food Packaging Philippines`,
    description: `Buy ${titleName} from ${SITE.name}. ${product.desc} ${product.dimensions}. Nationwide delivery across the Philippines. Wholesale & pickup in Pasay City.`,
    keywords: [
      product.name,
      titleName,
      product.category,
      product.color,
      "Ziyah Packaging Supplies",
      "food packaging Philippines",
      "wholesale packaging",
      "bento box Philippines",
      "sushi tray Philippines",
    ].filter(Boolean) as string[],
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${SITE.name}`,
      description: product.longDesc,
      images: absoluteImages,
      url: `/products/${product.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE.name}`,
      description: product.desc,
      images: [absoluteAssetUrl(primaryImage)],
    },
    other: {
      "og:image:alt": imageAlt,
      "product:brand": SITE.name,
      "product:availability": "in stock",
      "product:condition": "new",
      "product:price:amount": product.price.replace(/[^\d.]/g, ""),
      "product:price:currency": "PHP",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();

  const variants = getColorVariants(product);
  const faqs = getProductFaqs(product);
  const origin = getSiteOrigin();
  const productUrl = absoluteAssetUrl(`/products/${product.id}`);
  const titleName = product.displayName || product.name;

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
            name: titleName,
            item: productUrl,
          },
        ],
      },
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.longDesc,
        sku: `ZIYAH-${product.id}`,
        mpn: `ZIYAH-${product.id}`,
        image: imageObjects,
        category: product.category,
        color: product.color,
        material: product.type,
        brand: {
          "@type": "Brand",
          name: SITE.name,
        },
        manufacturer: {
          "@type": "Organization",
          name: SITE.name,
          url: origin,
        },
        additionalProperty: product.specs.map((spec) => ({
          "@type": "PropertyValue",
          name: spec.label,
          value: spec.value,
        })),
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "PHP",
          price: product.price.replace(/[^\d.]/g, "") || undefined,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: SITE.name,
            url: origin,
          },
          areaServed: {
            "@type": "Country",
            name: "Philippines",
          },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${productUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
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
          <span>{titleName}</span>
        </nav>

        <div className={styles.layout}>
          <ProductGallery
            key={product.id}
            images={product.images}
            name={product.name}
            video={product.video}
          />

          <ProductPurchasePanel product={product} variants={variants} />
        </div>

        <ProductSeoSections product={product} />
      </div>
    </main>
  );
}
