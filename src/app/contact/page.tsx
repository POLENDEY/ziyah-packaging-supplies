import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "./page.module.css";
import ContactForm from "./ContactForm";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Ziyah Packaging Supplies | Pasay City Store",
  description:
    "Visit our Pasay City store or message Ziyah Packaging Supplies for product questions, pickup, and nationwide delivery across the Philippines.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Contact Our Packaging Team</h1>
          <p>
            Reach us for product questions, store visits, and delivery coordination —
            serving food businesses nationwide from our home base in Pasay City,
            Philippines.
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
