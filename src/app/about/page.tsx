import styles from "./page.module.css";
import Image from "next/image";
import {
  IconClock,
  IconHandshake,
  IconLeaf,
  IconLightbulb,
  IconMap,
  IconMapPin,
  IconPackage,
  IconPhone,
  IconShield,
  IconTruck,
} from "../components/Icons";

const values = [
  {
    Icon: IconShield,
    title: "Food-Safe Standards",
    desc: "Every product we carry meets food-grade safety requirements — safe for direct food contact.",
  },
  {
    Icon: IconHandshake,
    title: "Trusted by Businesses",
    desc: "From home bakers to restaurant chains, businesses across Metro Manila rely on us daily.",
  },
  {
    Icon: IconLeaf,
    title: "Eco-Conscious Options",
    desc: "We offer biodegradable and compostable alternatives for environmentally conscious businesses.",
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
    title: "Reliable Delivery",
    desc: "Fast and reliable delivery across Metro Manila so your business never runs out of stock.",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>About Ziyah Packaging</h1>
          <p>Your trusted partner for food packaging in Metro Manila since day one.</p>
        </div>
      </div>

      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <h2>Who We Are</h2>
              <p>
                Ziyah Packaging Supplies is a packaging store based in Pasay City, Metro
                Manila, specializing in food packaging products for restaurants, caterers,
                home-based food businesses, and everyday consumers.
              </p>
              <p>
                We carry a wide range of products — from disposable bento boxes and sushi
                trays to reusable containers, clamshells, cups, food trays, and wrapping
                materials. Our goal is simple: provide high-quality, affordable packaging
                that meets food safety standards.
              </p>
              <p>
                Whether you&apos;re a small home baker packaging custom cakes, a restaurant
                owner looking for bulk takeaway containers, or a caterer preparing for a
                large event — we have the right packaging for you.
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
            <p>Our commitments to every customer we serve.</p>
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
                    Unit 103, Doña Adela Apartment
                    <br />
                    2247 F.B.Harrison St, Pasay City
                    <br />
                    Metro Manila
                  </p>
                </div>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <IconPhone size={20} />
                </span>
                <div>
                  <strong>Phone / Viber / SMS</strong>
                  <p>0966 847 3419</p>
                </div>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <IconClock size={20} />
                </span>
                <div>
                  <strong>Store Hours</strong>
                  <p>Open daily · Closes 6:30 PM</p>
                </div>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.locationItemIcon}>
                  <IconPackage size={20} />
                </span>
                <div>
                  <strong>Plus Code</strong>
                  <p>GXXV+R4 Pasay City, Metro Manila</p>
                </div>
              </div>
            </div>
            <div className={styles.mapPlaceholder}>
              <span className={styles.mapIcon}>
                <IconMap size={48} />
              </span>
              <p>
                <strong>Ziyah Packaging Supplies</strong>
                <br />
                Unit 103, Doña Adela Apartment
                <br />
                2247 F.B.Harrison St, Pasay City
              </p>
              <a
                href="https://maps.app.goo.gl/pasay"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
