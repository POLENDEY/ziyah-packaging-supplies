"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./admin.module.css";

type GalleryFile = {
  path: string;
  name: string;
  size: number;
  createdAt: string | null;
  url: string;
};

type GalleryProduct = {
  id: number;
  name: string;
  category: string;
  images: string[];
};

const PLACEHOLDER = "/dummy-post-square-1.webp";
const USAGE_LIMIT = 500 * 1024 * 1024;

type GalleryItem = {
  key: string;
  src: string;
  title: string;
  category: string;
  files: GalleryFile[];
};

function isPlaceholder(url: string) {
  return /dummy-post-square-1\.(webp|jpe?g|png)/i.test(url);
}

function filesForProduct(product: GalleryProduct, files: GalleryFile[]) {
  return files.filter(
    (file) =>
      file.path.startsWith(`products/${product.id}/`) ||
      product.images.some((url) => url.includes(file.path))
  );
}

function galleryItems(products: GalleryProduct[], files: GalleryFile[]): GalleryItem[] {
  const shown = new Set<string>();
  const items: GalleryItem[] = [];

  for (const product of products) {
    const owned = filesForProduct(product, files);
    const catalogImages = product.images.filter(
      (url) => url && !isPlaceholder(url) && !owned.some((file) => url.includes(file.path))
    );
    if (!owned.length && !catalogImages.length) {
      items.push({
        key: `product-${product.id}`,
        src: product.images.find((url) => url) || PLACEHOLDER,
        title: product.name,
        category: product.category,
        files: [],
      });
      continue;
    }
    for (const file of owned) {
      shown.add(file.path);
      items.push({
        key: file.path,
        src: file.url,
        title: product.name,
        category: product.category,
        files: [file],
      });
    }
    catalogImages.forEach((src, index) => {
      items.push({
        key: `${product.id}-${index}-${src}`,
        src,
        title: product.name,
        category: product.category,
        files: [],
      });
    });
  }

  for (const file of files) {
    if (shown.has(file.path)) continue;
    items.push({
      key: file.path,
      src: file.url,
      title: "Uploaded image",
      category: file.name,
      files: [file],
    });
  }

  return items;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function usageWidth(bytes: number) {
  const percent = Math.min(100, (bytes / USAGE_LIMIT) * 100);
  return bytes > 0 ? Math.max(percent, 2.5) : 0;
}

export default function MediaGallery() {
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [products, setProducts] = useState<GalleryProduct[]>([]);
  const [imageBytes, setImageBytes] = useState(0);
  const [textBytes, setTextBytes] = useState(0);
  const [databaseBytes, setDatabaseBytes] = useState(0);
  const [storageBytes, setStorageBytes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<GalleryFile[] | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not load gallery" });
        setFiles([]);
        setProducts([]);
        setImageBytes(0);
        setTextBytes(0);
        setDatabaseBytes(0);
        setStorageBytes(0);
        return;
      }
      const nextFiles: GalleryFile[] = Array.isArray(data.files) ? data.files : [];
      setFiles(nextFiles);
      setProducts(Array.isArray(data.products) ? data.products : []);
      setImageBytes(Number(data.imageBytes) || 0);
      setTextBytes(Number(data.textBytes) || 0);
      setDatabaseBytes(Number(data.databaseBytes) || 0);
      setStorageBytes(Number(data.storageBytes) || 0);
      setSelected((current) => {
        const live = new Set(nextFiles.map((file) => file.path));
        return new Set([...current].filter((path) => live.has(path)));
      });
    } catch {
      setMessage({ type: "err", text: "Could not load gallery" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = (path: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const items = useMemo(() => galleryItems(products, files), [products, files]);
  const selectedFiles = files.filter((file) => selected.has(file.path));
  const selectedBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const allSelected = files.length > 0 && selectedFiles.length === files.length;

  const remove = async () => {
    if (!pending?.length) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: pending.map((file) => file.path) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not delete image" });
        return;
      }
      const count = pending.length;
      setMessage({
        type: "ok",
        text: count === 1 ? "Image deleted." : `${count} images deleted.`,
      });
      setPending(null);
      await load();
    } catch {
      setMessage({ type: "err", text: "Could not delete image" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <div className={styles.gallerySummary}>
        <article className={styles.statCard}>
          <h3>Products</h3>
          <p>{loading ? "…" : products.length}</p>
        </article>
        <article className={`${styles.statCard} ${styles.statAccent}`}>
          <h3>Total usage</h3>
          <p>{loading ? "…" : formatBytes(databaseBytes + storageBytes)}</p>
        </article>
      </div>

      <div className={styles.usagePanel}>
        <div className={styles.usageHead}>
          <strong>File usage</strong>
          <span>
            {loading
              ? "…"
              : `${formatBytes(imageBytes + textBytes)} of ${formatBytes(USAGE_LIMIT)}`}
          </span>
        </div>
        <div
          className={styles.usageTrack}
          role="meter"
          aria-label="Images and inquiries"
          aria-valuemin={0}
          aria-valuemax={USAGE_LIMIT}
          aria-valuenow={Math.min(USAGE_LIMIT, imageBytes + textBytes)}
        >
          <span
            className={styles.usageImages}
            style={{ width: `${usageWidth(imageBytes)}%` }}
          />
          <span
            className={styles.usageOther}
            style={{ width: `${usageWidth(textBytes)}%` }}
          />
        </div>
        <div className={styles.usageLegend}>
          <span>
            <i className={styles.usageSwatchImages} />
            Images {loading ? "…" : formatBytes(imageBytes)}
          </span>
          <span>
            <i className={styles.usageSwatchOther} />
            Inquiries and text {loading ? "…" : formatBytes(textBytes)}
          </span>
        </div>
      </div>

      {message && (
        <p className={message.type === "ok" ? styles.galleryOk : styles.galleryErr}>
          {message.text}
        </p>
      )}

      {!loading && files.length > 0 && (
        <div className={styles.galleryTools}>
          <label className={styles.gallerySelectAll}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() =>
                setSelected(allSelected ? new Set() : new Set(files.map((file) => file.path)))
              }
            />
            Select all
          </label>
          <span>
            {selectedFiles.length} selected
            {selectedFiles.length > 0 ? ` · ${formatBytes(selectedBytes)}` : ""}
          </span>
          <button
            type="button"
            className={styles.galleryDeleteBtn}
            disabled={selectedFiles.length === 0}
            onClick={() => setPending(selectedFiles)}
          >
            Delete selected
          </button>
        </div>
      )}

      {loading ? (
        <p className={styles.galleryEmpty}>Loading gallery…</p>
      ) : products.length === 0 ? (
        <p className={styles.galleryEmpty}>No products in the database yet.</p>
      ) : (
        <ul className={styles.galleryGrid}>
          {items.map((item) => {
            const itemSelected =
              item.files.length > 0 && item.files.every((file) => selected.has(file.path));
            return (
              <li
                key={item.key}
                className={`${styles.galleryCard} ${itemSelected ? styles.galleryCardSelected : ""}`}
              >
                {item.files.length > 0 && (
                  <label className={styles.galleryCheck}>
                    <input
                      type="checkbox"
                      checked={itemSelected}
                      onChange={() => {
                        const allOn = item.files.every((file) => selected.has(file.path));
                        setSelected((current) => {
                          const next = new Set(current);
                          for (const file of item.files) {
                            if (allOn) next.delete(file.path);
                            else next.add(file.path);
                          }
                          return next;
                        });
                      }}
                      aria-label={`Select ${item.title}`}
                    />
                  </label>
                )}
                <div className={styles.galleryPick}>
                  <img src={item.src} alt="" />
                </div>
                <div className={styles.galleryMeta}>
                  <span className={styles.galleryName}>
                    {item.title}
                    {item.category ? (
                      <small className={styles.galleryCategory}>{item.category}</small>
                    ) : null}
                  </span>
                  {item.files.length > 0 && (
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => setPending(item.files)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pending && (
        <div className={styles.leaveOverlay} role="presentation">
          <div
            className={styles.leaveDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-image-title"
          >
            <h3 id="delete-image-title">
              {pending.length === 1 ? "Delete this image?" : `Delete ${pending.length} images?`}
            </h3>
            <p>
              This removes {formatBytes(pending.reduce((sum, file) => sum + file.size, 0))} from
              the gallery and from any product using {pending.length === 1 ? "it" : "them"}.
              Total usage is {formatBytes(databaseBytes + storageBytes)}.
            </p>
            <div className={styles.leaveActions}>
              <button
                type="button"
                className={styles.galleryDeleteBtn}
                disabled={deleting}
                onClick={remove}
              >
                {deleting
                  ? "Deleting…"
                  : pending.length === 1
                    ? "Delete image"
                    : `Delete ${pending.length} images`}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                disabled={deleting}
                onClick={() => setPending(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
