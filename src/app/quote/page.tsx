import type { Metadata } from "next";
import styles from "../contact/page.module.css";
import quoteStyles from "./page.module.css";
import QuoteForm from "./QuoteForm";

export const metadata: Metadata = {
  title: "Get a Wholesale Packaging Quote | Bulk Orders Philippines",
  description:
    "Request bulk and wholesale food packaging quotes from Ziyah Packaging Supplies. Competitive pricing for restaurants and brands nationwide in the Philippines.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <main className={styles.main}>
      <header className={`${styles.pageHeader} ${quoteStyles.quoteHeader}`}>
        <div className={styles.container}>
          <p className={quoteStyles.eyebrow}>Wholesale & Bulk Orders</p>
          <h1>Get a Custom Packaging Quote</h1>
          <p>
            Growing your food business? Share your product list and volume — we&apos;ll
            prepare a clear wholesale quote with options that fit your kitchen and budget.
          </p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <QuoteForm />
        </div>
      </section>
    </main>
  );
}
