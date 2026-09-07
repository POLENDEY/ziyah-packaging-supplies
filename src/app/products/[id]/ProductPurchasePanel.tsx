"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  buildInquireHref,
  getProductHref,
  type Product,
} from "@/data/products";
import {
  formatPeso,
  parsePeso,
  useProductQueue,
} from "@/app/components/ProductQueueProvider";
import QtyInput from "@/app/components/QtyInput";
import styles from "./detail.module.css";

type Props = {
  product: Product;
  variants: Product[];
};

export default function ProductPurchasePanel({ product, variants }: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [descOpen, setDescOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { itemCount, inquireHref: queueInquireHref, addToQueue } = useProductQueue();

  const hasColorPicker = variants.length > 1 && variants.every((v) => v.color);
  const showColor = Boolean(product.color);
  const title = product.displayName || product.name;
  const unitPrice = parsePeso(product.price);
  const currentLineTotal = unitPrice * qty;
  const singleInquireHref = useMemo(
    () => buildInquireHref(product, { quantity: qty }),
    [product, qty]
  );

  const selectColor = (variant: Product) => {
    if (variant.id === product.id) return;
    router.push(getProductHref(variant));
  };

  const handleAddToQueue = () => {
    addToQueue(
      {
        productId: product.id,
        name: product.name,
        displayName: title,
        color: product.color,
        category: product.category,
        unitPrice,
        unitPriceLabel: product.price,
        quantity: qty,
        image: product.images[0] || "",
      },
      { openCart: true }
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  const renderSwatch = (
    variant: Product,
    opts: { selected: boolean; interactive: boolean }
  ) => {
    const isCombo = variant.color === "Red & Black";
    const className = [
      styles.swatch,
      opts.selected ? styles.swatchActive : "",
      !opts.interactive ? styles.swatchStatic : "",
      isCombo ? styles.swatchCombo : "",
    ]
      .filter(Boolean)
      .join(" ");

    if (opts.interactive) {
      return (
        <button
          key={variant.id}
          type="button"
          role="option"
          aria-selected={opts.selected}
          aria-label={variant.color}
          title={`${variant.color} — ${variant.price}`}
          className={className}
          style={isCombo ? undefined : { background: variant.colorHex || "#ccc" }}
          onClick={() => selectColor(variant)}
        />
      );
    }

    return (
      <div
        key={variant.id}
        className={className}
        style={isCombo ? undefined : { background: variant.colorHex || "#ccc" }}
        title={variant.color}
        aria-hidden="true"
      />
    );
  };

  return (
    <div className={styles.buyPanel}>
      <p className={styles.category}>{product.category}</p>
      <h1 className={styles.title}>{title}</h1>

      <p className={styles.price}>
        {product.price}
        <span>{product.unit}</span>
      </p>

      <p className={styles.type}>{product.type}</p>

      {showColor && (
        <div className={styles.optionBlock}>
          <p className={styles.optionLabel}>
            Color: <strong>{product.color}</strong>
            {product.color === "Red & Black" && (
              <span className={styles.colorHint}>
                {" "}
                (red outside, black inside)
              </span>
            )}
          </p>
          {hasColorPicker ? (
            <div className={styles.swatches} role="listbox" aria-label="Color">
              {variants.map((variant) =>
                renderSwatch(variant, {
                  selected: variant.id === product.id,
                  interactive: true,
                })
              )}
            </div>
          ) : (
            renderSwatch(product, { selected: true, interactive: false })
          )}
        </div>
      )}

      <div className={styles.optionBlock}>
        <p className={styles.optionLabel}>Quantity</p>
        <div className={styles.qty}>
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((n) => Math.max(1, n - 1))}
          >
            −
          </button>
          <QtyInput
            value={qty}
            min={1}
            max={9999}
            aria-label="Quantity"
            onChange={setQty}
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((n) => Math.min(9999, n + 1))}
          >
            +
          </button>
        </div>
        <p className={styles.lineTotal} aria-live="polite">
          Line total: <strong>{formatPeso(currentLineTotal)}</strong>
          <span>
            ({qty} × {product.price})
          </span>
        </p>
      </div>

      <div className={styles.ctaStack}>
        <button type="button" className={styles.addQueue} onClick={handleAddToQueue}>
          {justAdded ? "Added to cart" : "Add to cart"}
        </button>
        <Link
          href={itemCount > 0 ? queueInquireHref : singleInquireHref}
          className={styles.primary}
        >
          {itemCount > 0
            ? `Inquire about cart (${itemCount})`
            : "Inquire about this product"}
        </Link>
        <Link href="/quote" className={styles.secondary}>
          Request wholesale quote
        </Link>
      </div>

      <div className={styles.descBlock}>
        <p className={descOpen ? styles.descFull : styles.descClamp}>
          {product.longDesc}
        </p>
        <button
          type="button"
          className={styles.readMore}
          onClick={() => setDescOpen((v) => !v)}
        >
          {descOpen ? "Read less" : "Read more"}
        </button>
      </div>

      <div className={styles.block}>
        <h2>Dimensions</h2>
        <p>{product.dimensions}</p>
      </div>

      <div className={styles.block}>
        <h2>Specifications</h2>
        <ul className={styles.specs}>
          {product.specs.map((spec) => (
            <li key={spec.label}>
              <strong>{spec.label}</strong>
              <span>{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
