import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { IconClock, IconMail, IconMapPin, IconPhone } from "./Icons";
import SocialLinks from "./SocialLinks";
import BrandWordmark from "./BrandWordmark";
import { SITE, SITE_SITELINKS } from "@/data/site";

export default function Footer() {
  const shopLinks = SITE_SITELINKS.filter((link) =>
    ["/products", "/quote"].some(
      (prefix) => link.path === prefix || link.path.startsWith("/products")
    )
  );
  const companyLinks = SITE_SITELINKS.filter((link) =>
    ["/about", "/contact"].includes(link.path)
  );
  return (
    <footer className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.brand}>
              <div className={styles.brandLogo}>
                <Image
                  src="/logo.png"
                  alt="Ziyah Packaging Supplies"
                  width={52}
                  height={52}
                  className={styles.brandIcon}
                />
                <div>
                  <BrandWordmark variant="onDark" size="md" />
                  <div className={styles.brandSub}>Supplies · Philippines</div>
                </div>
              </div>
              <p className={styles.brandDesc}>
                Food-grade packaging for restaurants, caterers, bakeries, and growing
                brands — delivering quality nationwide across the Philippines.
              </p>
              <SocialLinks variant="light" />
              <Link href="/quote" className={styles.brandCta}>
                Request a Wholesale Quote
              </Link>
            </div>

            <div className={styles.column}>
              <h4 className={styles.title}>Shop</h4>
              <div className={styles.links}>
                {shopLinks.map((link) => (
                  <Link key={link.path} href={link.path}>
                    {link.name}
                  </Link>
                ))}
                <a
                  href={SITE.social.shopee.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop on Shopee
                </a>
              </div>
            </div>

            <div className={styles.column}>
              <h4 className={styles.title}>Company</h4>
              <div className={styles.links}>
                <Link href="/">Home</Link>
                {companyLinks.map((link) => (
                  <Link key={link.path} href={link.path}>
                    {link.name}
                  </Link>
                ))}
                <a
                  href={SITE.social.facebook.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook Page
                </a>
                <a
                  href={SITE.social.messenger.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on Messenger
                </a>
              </div>
            </div>

            <div className={styles.column}>
              <h4 className={styles.title}>Visit & Reach Us</h4>
              <div className={styles.contactLine}>
                <IconMapPin size={16} />
                <p>{SITE.addressShort}</p>
              </div>
              <div className={styles.contactLine}>
                <IconPhone size={16} />
                <p>
                  <a href={SITE.phoneHref}>{SITE.phone}</a>
                </p>
              </div>
              <div className={styles.contactLine}>
                <IconMail size={16} />
                <p>
                  <a href={SITE.emailHref}>{SITE.email}</a>
                </p>
              </div>
              <div className={styles.contactLine}>
                <IconClock size={16} />
                <p>{SITE.hoursSummary}</p>
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <p className={styles.bottomText}>
              ©{" "}
              <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
              {SITE.name}. Serving food businesses nationwide across the Philippines.
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/contact">Contact</Link>
              <Link href="/quote">Get a Quote</Link>
              <a
                href={SITE.social.shopee.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Shopee
              </a>
              <a
                href={SITE.social.facebook.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href={SITE.social.messenger.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Messenger
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
