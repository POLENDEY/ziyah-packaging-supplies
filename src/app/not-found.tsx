import Link from "next/link";
import Image from "next/image";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <Image
          src="/logo.png"
          alt="Ziyah Packaging Supplies"
          width={88}
          height={88}
          className={styles.logo}
          priority
        />
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            Back to Home
          </Link>
          <Link href="/products" className={styles.secondary}>
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
}
