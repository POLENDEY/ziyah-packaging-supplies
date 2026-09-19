"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { IconPackage } from "../components/Icons";
import ProtectedProductImage from "../components/ProtectedProductImage";
import {
  buildInquireHref,
  getProductHref,
  getProductImageAlt,
  type Product,
} from "@/data/products";
import { getCategoryHref } from "@/data/categories";

type Props = {
  products: Product[];
  categories: string[];
  initialCategory?: string;
  /** When true, hide category chips and keep the filter fixed */
  lockCategory?: boolean;
};

export default function ProductsClient({
  products,
  categories,
  initialCategory = "All",
  lockCategory = false,
}: Props) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeType, setActiveType] = useState("All");
  const [query, setQuery] = useState("");
  const productCategories = ["All", ...categories];

  useEffect(() => {
    if (lockCategory) {
      setActiveCategory(initialCategory);
    } else {
      const raw = searchParams.get("category");
      if (raw) {
        const match = productCategories.find(
          (cat) => cat.toLowerCase() === decodeURIComponent(raw).toLowerCase()
        );
        if (match) setActiveCategory(match);
      } else {
        setActiveCategory("All");
      }
    }
    const q = searchParams.get("q");
    setQuery(q?.trim() ?? "");
  }, [searchParams, lockCategory, initialCategory, categories]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((p) => {
      const catMatch = activeCategory === "All" || p.category === activeCategory;
      const typeMatch = activeType === "All" || p.type === activeType;
      const textMatch =
        !q ||
        [p.name, p.category, p.desc, p.longDesc].some((field) =>
          field.toLowerCase().includes(q)
        );
      return catMatch && typeMatch && textMatch;
    });
  }, [activeCategory, activeType, query]);

  return (
    <>
      <div className={styles.filtersSection}>
        <div className={styles.container}>
          <div className={styles.filtersInner}>
            {!lockCategory && (
              <>
                <span className={styles.filterLabel}>Category:</span>
                {productCategories.map((cat) =>
                  cat === "All" ? (
                    <Link
                      key={cat}
                      href="/products"
                      className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
                    >
                      {cat}
                    </Link>
                  ) : (
                    <Link
                      key={cat}
                      href={getCategoryHref(cat)}
                      className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
                    >
                      {cat}
                    </Link>
                  )
                )}
              </>
            )}
            <span
              className={styles.filterLabel}
              style={lockCategory ? undefined : { marginLeft: 12 }}
            >
              Type:
            </span>
            {["All", "Disposable", "Reusable"].map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.filterBtn} ${activeType === t ? styles.filterBtnActive : ""}`}
                onClick={() => setActiveType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.productsGrid}>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <IconPackage size={48} />
                </div>
                <p>No products match your filters.</p>
              </div>
            ) : (
              filtered.map((product) => (
                <article key={product.id} className={styles.productCard}>
                  <Link
                    href={getProductHref(product)}
                    className={styles.productHit}
                    aria-label={`View details for ${product.name}`}
                  >
                    <div className={styles.productImageWrap}>
                      <ProtectedProductImage
                        src={product.images[0]}
                        alt={getProductImageAlt(product.name, product.images[0], 0, {
                          category: product.category,
                          color: product.color,
                          dimensions: product.dimensions,
                        })}
                        fill
                        sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={styles.productImage}
                      />
                      <span className={styles.viewHint}>View details</span>
                    </div>
                    <div className={styles.productBody}>
                      <div className={styles.productMeta}>
                        <span className={styles.productCategory}>{product.category}</span>
                        <span
                          className={`${styles.productBadge} ${styles[product.badge]}`}
                        >
                          {product.type}
                        </span>
                      </div>
                      <h3>{product.name}</h3>
                      <p className={styles.productDesc}>{product.desc}</p>
                    </div>
                  </Link>
                  <div className={styles.productFooter}>
                    <div className={styles.productPrice}>
                      {product.price}
                      <span className={styles.productPriceSub}>{product.unit}</span>
                    </div>
                    <Link href={buildInquireHref(product)} className={styles.inquireBtn}>
                      Inquire
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Need bulk pricing for your food business?</h2>
          <p>
            Get wholesale rates for restaurants, commissaries, and growing brands —
            nationwide across the Philippines.
          </p>
          <Link href="/quote" className={styles.btnPrimary}>
            Request a Wholesale Quote
          </Link>
        </div>
      </section>
    </>
  );
}
