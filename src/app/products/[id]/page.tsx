import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  absoluteAssetUrl,
  getProductFaqs,
  getProductImageAlt,
  getProductMetaDescription,
  getRelatedProducts,
  getSiteOrigin,
  type Product,
} from "@/data/products";
import { SITE } from "@/data/site";
import {
  getPublishedProductById,
  getPublishedProducts,
} from "@/lib/catalog/queries";
import ProductGallery from "./ProductGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductSeoSections from "./ProductSeoSections";
import styles from "./detail.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 60;
export const dynamicParams = true;

const COLOR_ORDER = ["Clear", "Black", "Red", "White"];

function getColorVariants(product: Product, catalog: Product[]): Product[] {
  if (!product.variantGroup) return [product];
  return catalog
    .filter((p) => p.variantGroup === product.variantGroup)
    .sort((a, b) => {
      const ai = COLOR_ORDER.indexOf(a.color || "");
      const bi = COLOR_ORDER.indexOf(b.color || "");
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
}

export async function generateStaticParams() {
  try {
    const products = await getPublishedProducts();
    return products.map((product) => ({ id: String(product.id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getPublishedProductById(Number(id));
  if (!product) {
    return { title: "Product Not Found" };
  }

  const imageMeta = {
    category: product.category,
    color: product.color,
    dimensions: product.dimensions,
  };
  const primaryImage = product.images[0];
  const imageAlt = getProductImageAlt(product.name, primaryImage, 0, imageMeta);
  const absoluteImages = product.images.map((src, i) => ({
    url: absoluteAssetUrl(src),
    alt: getProductImageAlt(product.name, src, i, imageMeta),
  }));
  const metaDescription = getProductMetaDescription(product);

  return {
    title: {
      absolute: `${product.name} | Buy Food Packaging Philippines | ${SITE.name}`,
    },
    description: metaDescription,
    keywords: [
      product.name,
      product.displayName || product.name,
      product.category,
      product.color,
      ...SITE.seoKeywords,
      "buy online Philippines",
      "wholesale packaging Pasay",
    ].filter(Boolean) as string[],
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: "website",
      locale: "en_PH",
      siteName: SITE.name,
      title: `${product.name} | ${SITE.name}`,
      description: product.longDesc.slice(0, 200),
      images: absoluteImages,
      url: `/products/${product.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE.name}`,
      description: product.desc,
      images: primaryImage ? [absoluteAssetUrl(primaryImage)] : ["/logo-512.png"],
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

function parsePrice(value: string) {
  const n = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const [product, catalog] = await Promise.all([
    getPublishedProductById(Number(id)),
    getPublishedProducts(),
  ]);
  if (!product) notFound();

  const variants = getColorVariants(product, catalog);
  const faqs = getProductFaqs(product);
  const origin = getSiteOrigin();
  const productUrl = absoluteAssetUrl(`/products/${product.id}`);
  const titleName = product.displayName || product.name;

  const tierPrices = product.priceTiers
    .map((t) => parsePrice(t.perPiece))
    .filter((n): n is number => n !== undefined);
  const lowPrice = tierPrices.length ? Math.min(...tierPrices) : parsePrice(product.price);
  const highPrice = tierPrices.length ? Math.max(...tierPrices) : parsePrice(product.price);
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;

  const imageMeta = {
    category: product.category,
    color: product.color,
    dimensions: product.dimensions,
  };
  const imageObjects = product.images.map((src, i) => ({
    "@type": "ImageObject",
    contentUrl: absoluteAssetUrl(src),
    url: absoluteAssetUrl(src),
    name: getProductImageAlt(product.name, src, i, imageMeta),
    description: `${product.longDesc} ${getProductImageAlt(product.name, src, i, imageMeta)}`,
    caption: getProductImageAlt(product.name, src, i, imageMeta),
    encodingFormat: src.toLowerCase().endsWith(".webp")
      ? "image/webp"
      : src.toLowerCase().endsWith(".jpg") || src.toLowerCase().endsWith(".jpeg")
        ? "image/jpeg"
        : "image/png",
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
          "@type": "AggregateOffer",
          url: productUrl,
          priceCurrency: "PHP",
          lowPrice: lowPrice,
          highPrice: highPrice,
          offerCount: product.priceTiers.length,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil,
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
            category={product.category}
            color={product.color}
            dimensions={product.dimensions}
          />

          <ProductPurchasePanel product={product} variants={variants} />
        </div>

        <ProductSeoSections
          product={product}
          related={getRelatedProducts(product, 4, catalog)}
        />
      </div>
    </main>
  );
}
