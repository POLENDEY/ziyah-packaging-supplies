"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import ProductGallery from "@/app/products/[id]/ProductGallery";
import ProductPurchasePanel from "@/app/products/[id]/ProductPurchasePanel";
import ProductSeoSections from "@/app/products/[id]/ProductSeoSections";
import detailStyles from "@/app/products/[id]/detail.module.css";
import styles from "./admin.module.css";

type Props = {
  product: Product;
  variants: Product[];
};

export default function ProductLivePreview({ product, variants }: Props) {
  const title = product.displayName || product.name;
  const [flashKey, setFlashKey] = useState(title);

  useEffect(() => {
    setFlashKey(title);
  }, [title]);

  return (
    <aside
      className={styles.livePreviewPane}
      aria-label="Live visitor product preview"
    >
      <p className={styles.livePreviewLabel}>Visitor view (live)</p>
      <div className={styles.livePreviewFrame}>
        <nav className={detailStyles.breadcrumb} aria-label="Breadcrumb preview">
          <span>Home</span>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span key={flashKey} className={styles.previewTitleFlash}>
            {title}
          </span>
        </nav>

        <div className={detailStyles.layout}>
          <ProductGallery
            key={product.images.join("|")}
            images={product.images}
            name={product.name}
            category={product.category}
            color={product.color}
            dimensions={product.dimensions}
          />
          <ProductPurchasePanel
            product={product}
            variants={variants.length ? variants : [product]}
            previewMode
          />
        </div>

        <ProductSeoSections product={product} related={[]} />
      </div>
    </aside>
  );
}
