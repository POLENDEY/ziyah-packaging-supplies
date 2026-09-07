import type { Metadata } from "next";
import styles from "../contact/page.module.css";
import quoteStyles from "./page.module.css";
import QuoteForm from "./QuoteForm";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Wholesale Quote | Bulk Food Packaging Philippines",
  description:
    "Request a wholesale food packaging quote from Ziyah Packaging Supplies. Bulk bento boxes and sushi trays for restaurants and brands nationwide in the Philippines.",
  keywords: [...SITE.seoKeywords, "wholesale packaging quote", "bulk bento box supplier"],
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Get a Wholesale Packaging Quote | Ziyah",
    description:
      "Share your product list and volume — clear bulk pricing for food businesses nationwide.",
    images: [{ url: "/logo.png", alt: SITE.name }],
    url: "/quote",
  },
};

export default function QuotePage() {
  return (
    <main className={styles.main}>
      <header className={`${styles.pageHeader} ${quoteStyles.quoteHeader}`}>
        <div className={styles.container}>
          <p className={quoteStyles.eyebrow}>Wholesale & Bulk Orders</p>
          <h1>Get a Wholesale Food Packaging Quote</h1>
          <p>
            Growing your restaurant or home food brand? Share the bento boxes, sushi trays,
            and quantities you need — we&apos;ll prepare a clear bulk quote for delivery
            nationwide across the Philippines.
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
