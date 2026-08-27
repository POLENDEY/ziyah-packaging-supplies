"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import ProductSearch from "./ProductSearch";
import BrandWordmark from "./BrandWordmark";
import { IconCart } from "./Icons";
import { useProductQueue } from "./ProductQueueProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, ready, openCart } = useProductQueue();

  const isAdminRoute = pathname?.startsWith("/ziyah-admin") || pathname?.startsWith("/admin");
  if (isAdminRoute) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const cartButton = (
    <button
      type="button"
      className={styles.cartBtn}
      onClick={() => {
        setIsOpen(false);
        openCart();
      }}
      aria-label={
        ready && itemCount > 0
          ? `Open shopping cart, ${itemCount} items`
          : "Open shopping cart"
      }
    >
      <IconCart size={22} />
      {ready && itemCount > 0 ? (
        <span className={styles.cartCount}>{itemCount > 99 ? "99+" : itemCount}</span>
      ) : null}
    </button>
  );

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
            className={styles.logoIcon}
          />
          <div className={styles.logoText}>
            <BrandWordmark variant="onLight" size="sm" />
          </div>
        </Link>

        <div className={styles.searchDesktop}>
          <ProductSearch collapsible />
        </div>

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
          <Link href="/quote" className={styles.ctaBtn}>
            Get a Quote
          </Link>
          {cartButton}
        </div>

        <div className={styles.mobileActions}>
          {cartButton}
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
      </div>

      <div
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={styles.drawerContent}
          onClick={(e) => e.stopPropagation()}
        >
          <ProductSearch
            className={styles.searchMobile}
            onNavigate={() => setIsOpen(false)}
          />
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
            href="/quote"
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
