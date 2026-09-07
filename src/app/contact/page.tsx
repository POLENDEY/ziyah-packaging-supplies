import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "./page.module.css";
import ContactForm from "./ContactForm";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Store | Food Packaging Pasay City",
  description:
    "Contact Ziyah Packaging Supplies in Pasay City for product questions, store pickup, wholesale orders, and nationwide food packaging delivery across the Philippines.",
  keywords: [...SITE.seoKeywords, "contact packaging supplier Pasay", "food packaging store near me"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Ziyah Packaging Supplies | Pasay City",
    description:
      "Visit our F.B. Harrison St store or message us for nationwide packaging delivery.",
    images: [{ url: "/logo.png", alt: SITE.name }],
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Contact Our Food Packaging Team in Pasay City</h1>
          <p>
            Ask about bento boxes, sushi trays, wholesale rates, store pickup, or nationwide
            delivery — we help food businesses across the Philippines find the right packaging.
          </p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <Suspense fallback={<div className={styles.formCard}>Loading contact form…</div>}>
            <ContactForm />
          </Suspense>

          <div className={styles.mapSection}>
            <h2>Find Our Store on the Map</h2>
            <p>
              Walk-ins welcome during store hours. Look for Ziyah Packaging Supplies on
              F.B. Harrison St, Pasay City.
            </p>
            <div className={styles.mapEmbed}>
              <iframe
                src={SITE.mapsEmbedUrl}
                title="Ziyah Packaging Supplies location map"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
