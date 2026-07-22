"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");
  if (isAdminRoute) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.png"
            alt="Ziyah Packaging Supplies"
            width={44}
            height={44}
            priority
          />
          <div className={styles.logoText}>
            <span className={styles.logoName}>ZIYAH PACKAGING</span>
            <span className={styles.logoSub}>Supplies</span>
          </div>
        </Link>

        <div className={styles.desktopMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.linkActive : ""}`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contact" className={styles.ctaBtn}>
            Get a Quote
          </Link>
        </div>

        <button
          className={`${styles.burger} ${isOpen ? styles.burgerActive : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={styles.drawerContent}
          onClick={(e) => e.stopPropagation()}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={styles.drawerLink}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className={styles.drawerCta}
            onClick={() => setIsOpen(false)}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </nav>
  );
}
