"use client";

import Link from "next/link";
import { getProductHref } from "@/data/products";
import {
  formatPeso,
  lineTotal,
  useProductQueue,
} from "./ProductQueueProvider";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const {
    items,
    ready,
    itemCount,
    grandTotalLabel,
    inquireHref,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearQueue,
  } = useProductQueue();

  if (!ready || !isCartOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeCart} role="presentation">
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <h2>Shopping cart</h2>
            {itemCount > 0 ? (
              <span className={styles.badge}>{itemCount}</span>
            ) : null}
          </div>
          <div className={styles.headActions}>
            {items.length > 0 ? (
              <button type="button" className={styles.clear} onClick={clearQueue}>
                Clear cart
              </button>
            ) : null}
            <button
              type="button"
              className={styles.close}
              aria-label="Close cart"
              onClick={closeCart}
            >
              ×
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <Link href="/products" className={styles.shopLink} onClick={closeCart}>
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.productId} className={styles.item}>
                  <Link
                    href={getProductHref(item.productId)}
                    className={styles.thumb}
                    aria-label={`View ${item.displayName || item.name}`}
                    onClick={closeCart}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || "/dummy-post-square-1.jpg"}
                      alt=""
                      width={72}
                      height={72}
                    />
                  </Link>

                  <div className={styles.body}>
                    <div className={styles.topRow}>
                      <div className={styles.info}>
                        <Link
                          href={getProductHref(item.productId)}
                          className={styles.name}
                          onClick={closeCart}
                        >
                          {item.displayName || item.name}
                        </Link>
                        {item.color ? (
                          <p className={styles.variant}>{item.color}</p>
                        ) : null}
                        <p className={styles.unit}>
                          {item.unitPriceLabel}
                          <span> / piece</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        className={styles.remove}
                        aria-label={`Remove ${item.displayName || item.name}`}
                        onClick={() => removeItem(item.productId)}
                      >
                        ×
                      </button>
                    </div>

                    <div className={styles.bottomRow}>
                      <div className={styles.qty}>
                        <button
                          type="button"
                          aria-label={`Decrease ${item.displayName}`}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.displayName}`}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className={styles.lineSum}>{formatPeso(lineTotal(item))}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.footer}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <strong aria-live="polite">{grandTotalLabel}</strong>
              </div>
              <p className={styles.hint}>
                Prices are estimates per piece. Final wholesale rates confirmed on inquiry.
              </p>
              <Link
                href={inquireHref}
                className={styles.checkout}
                onClick={closeCart}
              >
                Inquire about cart ({itemCount})
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
