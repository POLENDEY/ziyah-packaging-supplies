import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import {
  IconArrowRight,
  IconBento,
  IconCheck,
  IconClamshell,
  IconClock,
  IconCup,
  IconFactory,
  IconList,
  IconMapPin,
  IconPackage,
  IconPhone,
  IconSushi,
  IconTray,
  IconTruck,
} from "./components/Icons";

const categories = [
  {
    name: "Bento Boxes",
    desc: "Compartmented meal containers for bento-style servings.",
    Icon: IconBento,
    href: "/products?category=bento",
  },
  {
    name: "Sushi Trays",
    desc: "Sleek trays perfect for sushi and Japanese cuisine display.",
    Icon: IconSushi,
    href: "/products?category=sushi",
  },
  {
    name: "Clamshell Containers",
    desc: "Hinged containers ideal for salads, pastries, and more.",
    Icon: IconClamshell,
    href: "/products?category=clamshell",
  },
  {
    name: "Food Trays",
    desc: "Versatile trays for takeaway meals and catering events.",
    Icon: IconTray,
    href: "/products?category=trays",
  },
  {
    name: "Cups & Lids",
    desc: "Clear and opaque cups with matching lids for drinks.",
    Icon: IconCup,
    href: "/products?category=cups",
  },
  {
    name: "Wrapping & Film",
    desc: "Cling wraps, foil, and specialty food-grade wrapping film.",
    Icon: IconPackage,
    href: "/products?category=wrapping",
  },
];

const whyUs = [
  {
    title: "Food-Grade Quality",
    desc: "All our packaging meets food-safe standards — safe for direct food contact.",
    Icon: IconCheck,
  },
  {
    title: "Wide Product Range",
    desc: "From disposable trays to reusable containers — we have everything you need.",
    Icon: IconList,
  },
  {
    title: "Bulk & Retail Orders",
    desc: "Flexible ordering for small businesses, home cooks, and large catering operations.",
    Icon: IconFactory,
  },
  {
    title: "Fast Metro Manila Delivery",
    desc: "We deliver across Metro Manila quickly and reliably.",
    Icon: IconTruck,
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Pasay City, Metro Manila</div>
          <h1 className={styles.heroTitle}>
            Premium Food Packaging <br />
            <span>for Every Occasion</span>
          </h1>
          <p className={styles.heroDesc}>
            Bento boxes, sushi trays, clamshell containers, and more — sourced for
            restaurants, caterers, home bakers, and businesses of all sizes.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className={styles.btnPrimary}>
              Shop Products
            </Link>
            <Link href="/contact" className={styles.btnOutline}>
              Request a Quote
            </Link>
          </div>
        </div>
        <div className={styles.heroImageWrap}>
          <Image
            src="/logo.png"
            alt="Ziyah Packaging Supplies"
            width={320}
            height={320}
            className={styles.heroLogo}
            priority
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Browse by Category</h2>
            <p>Find the right packaging for your food business or event.</p>
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
            <h2>Why Choose Ziyah?</h2>
            <p>
              We&apos;ve been serving Metro Manila&apos;s packaging needs with quality and
              consistency.
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

      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to order?</h2>
            <p>
              Visit our store or send us an inquiry — we&apos;ll get back to you promptly.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/products" className={styles.btnWhite}>
                View All Products
              </Link>
              <Link href="/contact" className={styles.btnOutlineWhite}>
                Contact Us
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
                <p>
                  Unit 103, Doña Adela Apartment, 2247 F.B.Harrison St, Pasay City,
                  Metro Manila
                </p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>
                <IconPhone size={22} />
              </span>
              <div>
                <strong>Call / Viber / SMS</strong>
                <p>0966 847 3419</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>
                <IconClock size={22} />
              </span>
              <div>
                <strong>Store Hours</strong>
                <p>Open · Closes 6:30 PM daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
