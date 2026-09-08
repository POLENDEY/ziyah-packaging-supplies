import type { Metadata } from "next";
import styles from "./page.module.css";
import Link from "next/link";
import PromoMarquee from "./components/PromoMarquee";
import PromoBannerSlider from "./components/PromoBannerSlider";
import FeedbackSection from "./components/FeedbackSection";
import HeroFulfillmentScene from "./components/HeroFulfillmentScene";
import HomeScrollEffects from "./components/HomeScrollEffects";
import BrandWordmark from "./components/BrandWordmark";
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
import { SITE, SITE_SITELINKS, getSiteOrigin } from "@/data/site";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE.name} | Buy Food Packaging Philippines Nationwide`,
  },
  description:
    "Buy food packaging in the Philippines from Ziyah Packaging Supplies — bento boxes, sushi trays, and wholesale takeout containers. Pickup in Pasay City or delivery nationwide.",
  keywords: [...SITE.seoKeywords],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} | Food Packaging Philippines`,
    description:
      "Shop bento boxes, sushi trays, and wholesale food packaging. Nationwide delivery across the Philippines from our Pasay City store.",
    images: [{ url: "/logo-512.png", width: 512, height: 512, alt: SITE.name }],
    url: "/",
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Food Packaging Philippines`,
    description:
      "Food-grade bento boxes and sushi trays for restaurants and home businesses nationwide.",
    images: ["/logo-512.png"],
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
    desc: "Red outside, black inside bento boxes with clear lids for everyday takeout.",
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
    desc: "Round black sushi trays with gold pattern and lids — multiple sizes.",
    Icon: IconSushi,
    href: "/products?category=Round%20Sushi%20Trays",
  },
  {
    name: "Rectangular Sushi Trays",
    desc: "RE-ST series rectangular sushi trays with lids for plated sets.",
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
  const origin = getSiteOrigin();
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${origin}/#localbusiness`,
    name: SITE.name,
    description:
      "Ziyah Packaging Supplies sells food-grade packaging in the Philippines — bento boxes, sushi trays, and wholesale takeout containers with nationwide delivery from Pasay City.",
    image: `${origin}/logo-512.png`,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 103, Doña Adela Apartment, 2247 F.B. Harrison St",
      addressLocality: "Pasay City",
      addressRegion: "Metro Manila",
      postalCode: "1300",
      addressCountry: "PH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 14.5495,
      longitude: 120.9927,
    },
    areaServed: {
      "@type": "Country",
      name: "Philippines",
    },
    url: origin,
    priceRange: "₱",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Wednesday",
        opens: "08:00",
        closes: "18:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "08:00",
        closes: "14:30",
      },
    ],
    sameAs: [
      SITE.social.facebook.href,
      SITE.social.messenger.href,
      SITE.social.shopee.href,
    ],
    knowsAbout: [
      "food packaging Philippines",
      "bento boxes",
      "sushi trays",
      "wholesale packaging",
      "takeout containers",
    ],
  };

  const categoryListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shop food packaging by category",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: categories.length,
    itemListElement: categories.map((cat, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: cat.name,
      url: `${origin}${cat.href}`,
      description: cat.desc,
    })),
  };

  const sitelinksLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} popular pages`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: SITE_SITELINKS.length,
    itemListElement: SITE_SITELINKS.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.name,
      url: `${origin}${link.path}`,
      description: link.description,
    })),
  };

  return (
    <main className={styles.main}>
      <HomeScrollEffects />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksLd) }}
      />

      <section className={styles.hero}>
        <div className={styles.heroScene} aria-hidden="true">
          <HeroFulfillmentScene />
        </div>
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroContent} data-reveal>
            <div className={styles.heroBrand}>
              <BrandWordmark variant="onDark" size="lg" />
            </div>
            <div className={styles.heroBadge}>Pasay City · Nationwide PH</div>
            <h1 className={styles.heroTitle}>
              Buy Food Packaging{" "}
              <span>Nationwide in the Philippines</span>
            </h1>
            <p className={styles.heroDesc}>
              Food-grade bento boxes, sushi trays, and wholesale takeout packaging —
              from our Pasay City store to kitchens across the country.
            </p>
            <div className={styles.heroActions}>
              <Link href="/products" className={styles.btnPrimary}>
                Shop Products
              </Link>
              <Link href="/quote" className={styles.btnOutline}>
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div data-reveal>
        <PromoBannerSlider />
      </div>

      <div data-reveal>
        <PromoMarquee />
      </div>

      <section className={styles.section} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Shop Food Packaging by Category</h2>
            <p>
              Find disposable bento boxes and sushi trays for takeout, meal prep, catering,
              and retail — ready for food businesses nationwide across the Philippines.
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

      <section className={`${styles.section} ${styles.sectionAlt}`} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why Food Businesses Buy from Ziyah Packaging Supplies</h2>
            <p>
              We help restaurants, caterers, and home kitchens choose food-grade packaging
              that fits the menu — with clear wholesale options and delivery across the
              Philippines.
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

      <div data-reveal>
        <FeedbackSection />
      </div>

      <section className={styles.ctaBanner} data-reveal>
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

      <section className={styles.infoStrip} data-reveal>
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
