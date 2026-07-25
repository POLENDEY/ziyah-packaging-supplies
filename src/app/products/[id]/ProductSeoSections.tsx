import Link from "next/link";
import ProtectedProductImage from "@/app/components/ProtectedProductImage";
import {
  getProductFaqs,
  getProductHref,
  getProductImageAlt,
  getRelatedProducts,
  type Product,
} from "@/data/products";
import { SITE } from "@/data/site";
import styles from "./detail.module.css";

type Props = {
  product: Product;
};

export default function ProductSeoSections({ product }: Props) {
  const faqs = getProductFaqs(product);
  const related = getRelatedProducts(product, 4);
  const title = product.displayName || product.name;

  return (
    <div className={styles.seoWrap}>
      <section className={styles.trustStrip} aria-label="Why buy from Ziyah">
        <p>
          <strong>Nationwide PH delivery</strong>
          <span>{SITE.serviceArea}</span>
        </p>
        <p>
          <strong>Pasay City pickup</strong>
          <span>F.B. Harrison St store</span>
        </p>
        <p>
          <strong>Wholesale pricing</strong>
          <span>Pack &amp; box rates available</span>
        </p>
        <p>
          <strong>Food packaging specialists</strong>
          <span>Bento boxes, sushi trays &amp; more</span>
        </p>
      </section>

      <section className={styles.seoSection} aria-labelledby="key-features-heading">
        <h2 id="key-features-heading">Key features</h2>
        <ul className={styles.featureList}>
          <li>
            <span className={styles.featureLabel}>Product</span>
            <span>
              <strong>{title}</strong> — {product.desc}
            </span>
          </li>
          <li>
            <span className={styles.featureLabel}>Dimensions</span>
            <span>
              <strong>{product.dimensions}</strong>
            </span>
          </li>
          {product.specs.map((spec) => (
            <li key={spec.label}>
              <span className={styles.featureLabel}>{spec.label}</span>
              <span>
                <strong>{spec.value}</strong>
              </span>
            </li>
          ))}
          <li>
            <span className={styles.featureLabel}>Sold by</span>
            <span>
              <strong>{SITE.name}</strong> — restaurants &amp; food brands
              nationwide across the Philippines
            </span>
          </li>
        </ul>
      </section>

      <section className={styles.seoSection} aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently asked questions</h2>
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.question} className={styles.faqItem}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section
          className={styles.seoSection}
          aria-labelledby="related-heading"
        >
          <h2 id="related-heading">You may also like</h2>
          <p className={styles.relatedIntro}>
            More {product.category.toLowerCase()} and packaging options from{" "}
            {SITE.name}.
          </p>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <Link
                key={item.id}
                href={getProductHref(item)}
                className={styles.relatedCard}
              >
                <div className={styles.relatedMedia}>
                  <ProtectedProductImage
                    src={item.images[0]}
                    alt={getProductImageAlt(item.name, item.images[0], 0)}
                    fill
                    sizes="(max-width: 700px) 50vw, 220px"
                    className={styles.relatedImage}
                  />
                </div>
                <p className={styles.relatedCat}>{item.category}</p>
                <h3>{item.displayName || item.name}</h3>
                <p className={styles.relatedPrice}>
                  {item.price}
                  <span>{item.unit}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={styles.pageFooterNav}>
        <Link href="/products" className={styles.backLink}>
          ← Back to products
        </Link>
      </div>
    </div>
  );
}
