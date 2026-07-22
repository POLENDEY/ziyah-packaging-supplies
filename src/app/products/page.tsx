import type { Metadata } from "next";
import styles from "./page.module.css";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Food Packaging Products for Sale | Bento, Trays & Cups",
  description:
    "Shop food-grade packaging in the Philippines: bento boxes, sushi trays, clamshells, cups, and wrapping supplies. Bulk and retail orders welcome.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Food Packaging Products | Ziyah Packaging Supplies",
    description:
      "Browse disposable and reusable food packaging trusted by restaurants and home businesses nationwide.",
  },
};

export default function ProductsPage() {
  return (
    <main className={styles.main}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Food Packaging Products for Every Business</h1>
          <p>
            From bento boxes to cling wrap — food-safe packaging priced for cafés,
            restaurants, caterers, and growing brands across the Philippines.
          </p>
        </div>
      </header>
      <ProductsClient />
    </main>
  );
}
