import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { IconClock, IconMapPin, IconPhone } from "./Icons";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.brand}>
              <div className={styles.brandLogo}>
                <Image
                  src="/logo.png"
                  alt="Ziyah Packaging"
                  width={42}
                  height={42}
                />
                <div>
                  <div className={styles.brandName}>ZIYAH PACKAGING</div>
                  <div className={styles.brandSub}>Supplies</div>
                </div>
              </div>
              <p className={styles.brandDesc}>
                Premium food packaging for restaurants, caterers, home bakers, and
                businesses across Metro Manila.
              </p>
            </div>

            <div className={styles.column}>
              <h4 className={styles.title}>Products</h4>
              <div className={styles.links}>
                <Link href="/products?category=bento">Bento Boxes</Link>
                <Link href="/products?category=sushi">Sushi Trays</Link>
                <Link href="/products?category=clamshell">Clamshell Containers</Link>
                <Link href="/products?category=trays">Food Trays</Link>
                <Link href="/products?category=cups">Cups & Lids</Link>
                <Link href="/products?category=wrapping">Wrapping & Film</Link>
              </div>
            </div>

            <div className={styles.column}>
              <h4 className={styles.title}>Company</h4>
              <div className={styles.links}>
                <Link href="/">Home</Link>
                <Link href="/products">All Products</Link>
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>

            <div className={styles.column}>
              <h4 className={styles.title}>Contact Us</h4>
              <div className={styles.contactLine}>
                <IconMapPin size={16} />
                <p>
                  Unit 103, Doña Adela Apartment, 2247 F.B.Harrison St, Pasay City,
                  Metro Manila
                </p>
              </div>
              <div className={styles.contactLine}>
                <IconPhone size={16} />
                <p>0966 847 3419</p>
              </div>
              <div className={styles.contactLine}>
                <IconClock size={16} />
                <p>Open · Closes 6:30 PM</p>
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <p className={styles.bottomText}>
              ©{" "}
              <span suppressHydrationWarning>{new Date().getFullYear()}</span> Ziyah
              Packaging Supplies. All rights reserved.
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/contact">Privacy Policy</Link>
              <Link href="/contact">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
