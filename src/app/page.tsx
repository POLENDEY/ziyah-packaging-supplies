import type { Metadata } from "next";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import PromoMarquee from "./components/PromoMarquee";
import PromoBannerSlider from "./components/PromoBannerSlider";
import FeedbackSection from "./components/FeedbackSection";
import {
  IconArrowRight,
  IconBento,
  IconCheck,
  IconClock,
  IconFactory,
  IconList,
  IconMail,
  IconMapPin,
  IconPackage,
  IconPhone,
  IconSushi,
  IconTray,
  IconTruck,
} from "./components/Icons";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Ziyah Packaging Supplies | Food Packaging Nationwide Philippines",
  description:
    "Buy food-grade packaging in the Philippines: bento boxes, sushi trays, clamshells, cups, and wrapping. Bulk & retail for restaurants, caterers, and home businesses.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ziyah Packaging Supplies | Food Packaging Nationwide",
    description:
      "Premium disposable and reusable food packaging delivered nationwide across the Philippines.",
  },
};

const categories = [
  {
    name: "Hard Bento Clear",
    desc: "Clear hard bento boxes with lids — 2 to 5 divisions, 1000ml.",
    Icon: IconBento,
    href: "/products?category=Hard%20Bento%20Clear",
  },
  {
    name: "Bento Boxes",
    desc: "Red-base bento boxes with clear lids for everyday takeout.",
    Icon: IconPackage,
    href: "/products?category=Bento%20Boxes",
  },
  {
    name: "Hard Bento Black",
    desc: "Black hard bento boxes with lids — premium meal presentation.",
    Icon: IconBento,
    href: "/products?category=Hard%20Bento%20Black",
  },
  {
    name: "Round Sushi Trays",
    desc: "Round black sushi trays with gold pattern and lids.",
    Icon: IconSushi,
    href: "/products?category=Round%20Sushi%20Trays",
  },
  {
    name: "Rectangular Sushi Trays",
    desc: "RE-ST series rectangular sushi trays with lids.",
    Icon: IconTray,
    href: "/products?category=Rectangular%20Sushi%20Trays",
  },
];

const whyUs = [
  {
    title: "Food-Grade Quality",
    desc: "Packaging chosen for safe food contact — so your brand ships with confidence.",
    Icon: IconCheck,
  },
  {
    title: "Wide Product Range",
    desc: "From disposable trays to reusable containers — stock what your menu needs.",
    Icon: IconList,
  },
  {
    title: "Bulk & Retail Orders",
    desc: "Flexible ordering for small kitchens, home businesses, and high-volume operations.",
    Icon: IconFactory,
  },
  {
    title: "Nationwide Delivery",
    desc: "We serve food businesses across the Philippines — not just Metro Manila.",
    Icon: IconTruck,
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ziyahpackagingsupplies.com"}/logo.png`,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 103, Doña Adela Apartment, 2247 F.B. Harrison St",
      addressLocality: "Pasay City",
      addressRegion: "Metro Manila",
      addressCountry: "PH",
    },
    areaServed: "Philippines",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ziyahpackagingsupplies.com",
    sameAs: [
      SITE.social.facebook.href,
      SITE.social.messenger.href,
      SITE.social.shopee.href,
    ],
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Pasay City · Serving Nationwide PH</div>
          <h1 className={styles.heroTitle}>
            Food Packaging Supplies <br />
            <span>Built for Growing Brands</span>
          </h1>
          <p className={styles.heroDesc}>
            Stock food-safe bento boxes, sushi trays, clamshells, cups, and wraps —
            trusted by restaurants, caterers, and home bakers across the Philippines.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className={styles.btnPrimary}>
              Shop Products
            </Link>
            <Link href="/quote" className={styles.btnOutline}>
              Get a Wholesale Quote
            </Link>
          </div>
        </div>
        <div className={styles.heroImageWrap}>
          <Image
            src="/logo.png"
            alt="Ziyah Packaging Supplies logo"
            width={320}
            height={320}
            className={styles.heroLogo}
            priority
          />
        </div>
      </section>

      <PromoBannerSlider />

      <PromoMarquee />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Shop Packaging by Category</h2>
            <p>
              Find the right food packaging for takeout, meal prep, catering, and retail
              — ready for businesses nationwide.
            </p>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>
                  <cat.Icon size={24} />
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
                <span className={styles.categoryArrow}>
                  Shop <IconArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why Food Businesses Choose Ziyah</h2>
            <p>
              We&apos;ve been serving packaging needs across the Philippines with quality,
              consistency, and practical guidance for every order size.
            </p>
          </div>
          <div className={styles.whyGrid}>
            {whyUs.map((item) => (
              <div key={item.title} className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <item.Icon size={24} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeedbackSection />

      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to stock up?</h2>
            <p>
              Browse products online or request a wholesale quote — we&apos;ll help you
              choose packaging that fits your menu and budget.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/products" className={styles.btnWhite}>
                View All Products
              </Link>
              <Link href="/contact" className={styles.btnOutlineWhite}>
                Contact the Store
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.infoStrip}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>
                <IconMapPin size={22} />
              </span>
              <div>
                <strong>Our Address</strong>
                <p>{SITE.addressShort}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>
                <IconPhone size={22} />
              </span>
              <div>
                <strong>Call / Viber / SMS</strong>
                <p>{SITE.phone}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>
                <IconMail size={22} />
              </span>
              <div>
                <strong>Email</strong>
                <p>{SITE.email}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>
                <IconClock size={22} />
              </span>
              <div>
                <strong>Store Hours</strong>
                <p>{SITE.hoursSummary}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
