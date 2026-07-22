import type { Metadata } from "next";
import styles from "./page.module.css";
import Image from "next/image";
import {
  IconClock,
  IconHandshake,
  IconLeaf,
  IconLightbulb,
  IconMail,
  IconMapPin,
  IconPackage,
  IconPhone,
  IconShield,
  IconTruck,
} from "../components/Icons";
import SocialLinks from "../components/SocialLinks";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "About Ziyah Packaging Supplies | Nationwide Food Packaging PH",
  description:
    "Learn about Ziyah Packaging Supplies in Pasay City — food-grade packaging partner for restaurants and home businesses nationwide across the Philippines.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    Icon: IconShield,
    title: "Food-Safe Standards",
    desc: "Every product we carry meets food-grade safety requirements — safe for direct food contact.",
  },
  {
    Icon: IconHandshake,
    title: "Trusted by Businesses",
    desc: "From home bakers to restaurant chains, businesses across the Philippines rely on us daily.",
  },
  {
    Icon: IconLeaf,
    title: "Eco-Conscious Options",
    desc: "We offer biodegradable and compostable alternatives for environmentally conscious brands.",
  },
  {
    Icon: IconLightbulb,
    title: "Expert Guidance",
    desc: "Not sure what packaging you need? Our team helps you find the right solution for your product.",
  },
  {
    Icon: IconPackage,
    title: "Bulk & Wholesale",
    desc: "Flexible pricing for bulk orders — the more you order, the better the value you get.",
  },
  {
    Icon: IconTruck,
    title: "Nationwide Delivery",
    desc: "Reliable delivery coordination across the Philippines so your business never runs out of stock.",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>About Ziyah Packaging Supplies</h1>
          <p>
            Your packaging partner based in Pasay City — supplying food businesses
            nationwide across the Philippines.
          </p>
        </div>
      </header>

      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <h2>Who We Are</h2>
              <p>
                Ziyah Packaging Supplies is a packaging store based in Pasay City, Metro
                Manila, specializing in food packaging for restaurants, caterers,
                home-based food businesses, and everyday consumers.
              </p>
              <p>
                We carry disposable bento boxes, sushi trays, reusable containers,
                clamshells, cups, food trays, and wrapping materials. Our goal is simple:
                high-quality, affordable packaging that meets food safety standards.
              </p>
              <p>
                Whether you&apos;re a home baker, a restaurant stocking takeaway packs, or
                a caterer preparing for a large event — we help you package with
                confidence, anywhere in the Philippines.
              </p>
            </div>
            <div className={styles.storyImage}>
              <Image
                src="/logo.png"
                alt="Ziyah Packaging Supplies"
                width={200}
                height={200}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>What We Stand For</h2>
            <p>Our commitments to every customer we serve nationwide.</p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <v.Icon size={26} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.locationSection}>
        <div className={styles.container}>
          <div className={styles.locationGrid}>
            <div className={styles.locationContent}>
              <h2>Find Us</h2>
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
                <strong>Follow & Shop Online</strong>
                <SocialLinks variant="dark" />
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
