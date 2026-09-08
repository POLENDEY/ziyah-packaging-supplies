import type { Metadata } from "next";
import Link from "next/link";
import {
  IconClock,
  IconMail,
  IconMapPin,
  IconPackage,
  IconPhone,
} from "../components/Icons";
import SocialLinks from "../components/SocialLinks";
import { SITE } from "@/data/site";
import AboutMarqueeBands from "./AboutMarqueeBands";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us | Food Packaging Supplier Pasay & Nationwide PH",
  description:
    "Meet Ziyah Packaging Supplies — your food packaging partner in Pasay City. Food-grade bento boxes and sushi trays for restaurants and home businesses nationwide in the Philippines.",
  keywords: [...SITE.seoKeywords, "about Ziyah Packaging", "packaging supplier Pasay"],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Ziyah Packaging Supplies",
    description:
      "Food-grade packaging from Pasay City with nationwide delivery across the Philippines.",
    images: [{ url: "/logo-512.png", alt: SITE.name }],
    url: "/about",
  },
};

const collections = [
  {
    name: "Hard Bento Clear",
    desc: "Clear hard bento with lids — 2 to 5 divisions.",
    href: "/products?category=Hard%20Bento%20Clear",
  },
  {
    name: "Bento Boxes",
    desc: "Red outside, black inside — everyday takeout.",
    href: "/products?category=Bento%20Boxes",
  },
  {
    name: "Hard Bento Black",
    desc: "Black hard bento for premium meal presentation.",
    href: "/products?category=Hard%20Bento%20Black",
  },
  {
    name: "Sushi Trays",
    desc: "Round & rectangular trays with lids.",
    href: "/products?category=Round%20Sushi%20Trays",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Food packaging · Pasay &amp; nationwide</p>
          <h1>Ziyah Packaging Supplies — Food Packaging from Pasay, Nationwide</h1>
          <p className={styles.heroLead}>
            From our store in Pasay City, we supply food-grade bento boxes, sushi trays,
            and takeout packaging to restaurants, caterers, and home businesses across
            the Philippines. Quality you can plate with — delivered where you need it.
          </p>
          <p className={styles.heroAttribution}>
            <strong>— {SITE.name}</strong>
            <span>Pasay City · Nationwide PH</span>
          </p>
        </div>
      </section>

      <AboutMarqueeBands />

      <section className={styles.whoSection}>
        <div className={styles.containerNarrow}>
          <p className={styles.sectionEyebrow}>Who we are</p>
          <h2>Packaging that keeps food businesses moving</h2>
          <p>
            Ziyah Packaging Supplies specializes in disposable and reusable food packaging
            for takeout, meal prep, catering, and retail. We stock clear and black hard
            bento boxes, red-and-black soft bentos, round and rectangular sushi trays, and
            everyday supplies chosen for food contact safety.
          </p>
          <p>
            Whether you pick up at our F.B. Harrison St store or order for delivery
            nationwide, our team helps you match packaging to your menu, portion size, and
            budget — from small starter packs to full wholesale boxes.
          </p>
        </div>
      </section>

      <AboutMarqueeBands />

      <section className={styles.missionSection}>
        <div className={styles.containerNarrow}>
          <p className={styles.sectionEyebrow}>What we offer</p>
          <h2>Practical packaging, from store shelf to your kitchen</h2>
          <p>
            We focus on products food businesses actually use — clear lids, reliable
            divisions, and options for clear, black, or red-and-black finishes. Explore
            our core collections and find the right fit for your next order.
          </p>
        </div>
        <div className={styles.collectionGrid}>
          {collections.map((item) => (
            <Link key={item.name} href={item.href} className={styles.collectionCard}>
              <div className={styles.collectionCopy}>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <span>Shop now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.locationSection}>
        <div className={styles.container}>
          <div className={styles.locationGrid}>
            <div className={styles.locationContent}>
              <p className={styles.sectionEyebrow}>Visit us</p>
              <h2>Find our Pasay City store</h2>
              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <IconMapPin size={20} />
                </span>
                <div>
                  <strong>Address</strong>
                  <p>
                    {SITE.addressLines.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <IconPhone size={20} />
                </span>
                <div>
                  <strong>Phone / Viber / SMS</strong>
                  <p>{SITE.phone}</p>
                </div>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <IconMail size={20} />
                </span>
                <div>
                  <strong>Email</strong>
                  <p>
                    <a href={SITE.emailHref}>{SITE.email}</a>
                  </p>
                </div>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <IconClock size={20} />
                </span>
                <div>
                  <strong>Store Hours</strong>
                  <ul className={styles.hoursList}>
                    {SITE.hours.map((row) => (
                      <li key={row.day}>
                        <span>{row.day}</span>
                        <span>{row.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <IconPackage size={20} />
                </span>
                <div>
                  <strong>Plus Code</strong>
                  <p>{SITE.plusCode}</p>
                </div>
              </div>
              <div className={styles.socialBlock}>
                <strong>Follow &amp; shop online</strong>
                <SocialLinks variant="dark" />
              </div>
              <div className={styles.locationCtas}>
                <Link href="/products" className={styles.btnPrimary}>
                  Browse products
                </Link>
                <Link href="/contact" className={styles.btnGhost}>
                  Contact the store
                </Link>
              </div>
            </div>
            <div className={styles.mapEmbed}>
              <iframe
                src={SITE.mapsEmbedUrl}
                title="Ziyah Packaging Supplies on Google Maps"
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
