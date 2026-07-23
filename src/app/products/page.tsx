import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "./page.module.css";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Food Packaging Products for Sale | Bento & Sushi Trays",
  description:
    "Shop official Ziyah packaging: hard bento clear/black, bento boxes, round and rectangular sushi trays with volume pricing.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Food Packaging Products | Ziyah Packaging Supplies",
    description:
      "Browse official bento boxes and sushi trays with box, pack, and piece pricing.",
  },
};

export default function ProductsPage() {
  return (
    <main className={styles.main}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Official Food Packaging Products</h1>
          <p>
            Hard bento boxes, meal bento boxes, and sushi trays — with official
            quantity pricing for businesses nationwide.
          </p>
        </div>
      </header>
      <Suspense fallback={<div className={styles.container}>Loading products…</div>}>
        <ProductsClient />
      </Suspense>
    </main>
  );
}
