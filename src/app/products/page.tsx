"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { IconPackage } from "../components/Icons";

const PRODUCT_IMAGE = "/dummy-post-square-1.jpg";

const products = [
  { id: 1, name: "3-Compartment Bento Box", category: "Bento Boxes", desc: "Black PP plastic bento with 3 compartments and clear lid.", type: "Disposable", price: "₱8", unit: "/ piece", badge: "badgeDisposable" },
  { id: 2, name: "5-Compartment Bento Box", category: "Bento Boxes", desc: "Large 5-section meal prep bento box with secure snap lid.", type: "Disposable", price: "₱12", unit: "/ piece", badge: "badgeDisposable" },
  { id: 3, name: "Kraft Paper Bento Box", category: "Bento Boxes", desc: "Eco-friendly kraft paper bento, microwave-safe inner coating.", type: "Disposable", price: "₱15", unit: "/ piece", badge: "badgeNew" },
  { id: 4, name: "Sushi Tray w/ Clear Lid (Small)", category: "Sushi Trays", desc: "Crystal-clear OPS tray for 6–8 pcs sushi. Anti-fog lid.", type: "Disposable", price: "₱10", unit: "/ piece", badge: "badgeDisposable" },
  { id: 5, name: "Sushi Tray w/ Clear Lid (Large)", category: "Sushi Trays", desc: "Wide-format tray fits 12–16 pcs sushi or rolls.", type: "Disposable", price: "₱14", unit: "/ piece", badge: "badgeDisposable" },
  { id: 6, name: "Black Sushi Display Tray", category: "Sushi Trays", desc: "Premium matte-black tray ideal for display counters.", type: "Reusable", price: "₱25", unit: "/ piece", badge: "badgeReusable" },
  { id: 7, name: "6-inch Clamshell (Clear)", category: "Clamshell Containers", desc: "Clear PET clamshell perfect for salads, fruits, pastries.", type: "Disposable", price: "₱7", unit: "/ piece", badge: "badgeDisposable" },
  { id: 8, name: "9-inch Clamshell (Black Base)", category: "Clamshell Containers", desc: "Black base with clear top lid, great for meal packaging.", type: "Disposable", price: "₱11", unit: "/ piece", badge: "badgeDisposable" },
  { id: 9, name: "Round Burger Clamshell", category: "Clamshell Containers", desc: "Round 5-inch clamshell for burgers and buns.", type: "Disposable", price: "₱6", unit: "/ piece", badge: "badgeDisposable" },
  { id: 10, name: "Oval Foam Tray (White)", category: "Food Trays", desc: "Lightweight EPS foam tray for meats, poultry, vegetables.", type: "Disposable", price: "₱4", unit: "/ piece", badge: "badgeDisposable" },
  { id: 11, name: "Rectangular PP Tray w/ Lid", category: "Food Trays", desc: "Durable PP tray with tight-fit lid, freezer safe.", type: "Reusable", price: "₱18", unit: "/ piece", badge: "badgeReusable" },
  { id: 12, name: "Aluminum Foil Tray (Medium)", category: "Food Trays", desc: "Heat-resistant foil tray for oven and catering use.", type: "Disposable", price: "₱9", unit: "/ piece", badge: "badgeDisposable" },
  { id: 13, name: "16oz Plastic Cup (Clear)", category: "Cups & Lids", desc: "Crystal-clear PET cold drink cup, 16oz. Matching lid available.", type: "Disposable", price: "₱5", unit: "/ piece", badge: "badgeDisposable" },
  { id: 14, name: "22oz Disposable Tumbler", category: "Cups & Lids", desc: "Wide-mouth tumbler great for milk tea and iced drinks.", type: "Disposable", price: "₱7", unit: "/ piece", badge: "badgeNew" },
  { id: 15, name: "Dome Lid (Medium)", category: "Cups & Lids", desc: "Dome-shaped lids with straw hole, fits 12–16oz cups.", type: "Disposable", price: "₱2", unit: "/ piece", badge: "badgeDisposable" },
  { id: 16, name: "PVC Cling Wrap Roll (30cm)", category: "Wrapping & Film", desc: "Food-grade cling wrap, 30cm × 100m roll.", type: "Disposable", price: "₱120", unit: "/ roll", badge: "badgeDisposable" },
  { id: 17, name: "Shrink Wrap Film", category: "Wrapping & Film", desc: "Heat-shrink film for sealing trays and products.", type: "Disposable", price: "₱250", unit: "/ roll", badge: "badgeNew" },
  { id: 18, name: "Greaseproof Baking Paper", category: "Wrapping & Film", desc: "Non-stick baking paper, 40cm × 50m roll.", type: "Disposable", price: "₱180", unit: "/ roll", badge: "badgeDisposable" },
];

const categories = [
  "All",
  "Bento Boxes",
  "Sushi Trays",
  "Clamshell Containers",
  "Food Trays",
  "Cups & Lids",
  "Wrapping & Film",
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catMatch = activeCategory === "All" || p.category === activeCategory;
      const typeMatch = activeType === "All" || p.type === activeType;
      return catMatch && typeMatch;
    });
  }, [activeCategory, activeType]);

  return (
    <main className={styles.main}>
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Our Products</h1>
          <p>
            Explore our wide range of food packaging — disposable & reusable options for
            every need.
          </p>
        </div>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.container}>
          <div className={styles.filtersInner}>
            <span className={styles.filterLabel}>Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
            <span className={styles.filterLabel} style={{ marginLeft: 12 }}>
              Type:
            </span>
            {["All", "Disposable", "Reusable"].map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.filterBtn} ${activeType === t ? styles.filterBtnActive : ""}`}
                onClick={() => setActiveType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.productsGrid}>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <IconPackage size={48} />
                </div>
                <p>No products match your filters.</p>
              </div>
            ) : (
              filtered.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImageWrap}>
                    <Image
                      src={PRODUCT_IMAGE}
                      alt={product.name}
                      fill
                      sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productBody}>
                    <div className={styles.productMeta}>
                      <span className={styles.productCategory}>{product.category}</span>
                      <span
                        className={`${styles.productBadge} ${styles[product.badge as keyof typeof styles]}`}
                      >
                        {product.type}
                      </span>
                    </div>
                    <h3>{product.name}</h3>
                    <p className={styles.productDesc}>{product.desc}</p>
                    <div className={styles.productFooter}>
                      <div className={styles.productPrice}>
                        {product.price}
                        <span className={styles.productPriceSub}>{product.unit}</span>
                      </div>
                      <Link href="/contact" className={styles.inquireBtn}>
                        Inquire
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Need bulk pricing or custom orders?</h2>
          <p>
            We accommodate wholesale, bulk, and custom packaging requests. Send us an
            inquiry today.
          </p>
          <Link href="/contact" className={styles.btnPrimary}>
            Send an Inquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
