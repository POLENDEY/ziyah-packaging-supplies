"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./admin.module.css";
import type { Product, PriceTier, ProductFaq } from "@/data/products";
import type { DbCategory } from "@/lib/catalog/types";

const PAGE_SIZE = 10;

type FormState = {
  id?: number;
  name: string;
  displayName: string;
  description: string;
  longDescription: string;
  aboutExtra: string;
  bestFor: string;
  categoryId: number | "";
  type: "Disposable" | "Reusable";
  color: string;
  dimensions: string;
  unit: string;
  price: string;
  priceTiers: PriceTier[];
  specs: { label: string; value: string }[];
  faqs: ProductFaq[];
  images: string[];
  isPublished: boolean;
};

const emptyForm = (): FormState => ({
  name: "",
  displayName: "",
  description: "",
  longDescription: "",
  aboutExtra: "",
  bestFor: "",
  categoryId: "",
  type: "Disposable",
  color: "",
  dimensions: "",
  unit: "/ piece",
  price: "",
  priceTiers: [{ quantity: "1 BOX", price: "", perPiece: "" }],
  specs: [{ label: "", value: "" }],
  faqs: [{ question: "", answer: "" }],
  images: [],
  isPublished: true,
});

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [mode, setMode] = useState<"list" | "form">("list");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [newCatName, setNewCatName] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "All") return products;
    return products.filter((p) => p.category === categoryFilter);
  }, [products, categoryFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter]);

  const load = async () => {
    setLoading(true);
    const [pRes, cRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);
    const pData = await pRes.json();
    const cData = await cRes.json();
    if (pRes.ok) setProducts(pData.products || []);
    else setMessage({ type: "err", text: pData.error || "Failed products" });
    if (cRes.ok) setCategories(cData.categories || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const categoryIdForProduct = (p: Product) => {
    const match = categories.find((c) => c.name === p.category);
    return match?.id ?? "";
  };

  const startCreate = () => {
    setForm(emptyForm());
    setMode("form");
    setMessage(null);
  };

  const startEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      displayName: p.displayName || "",
      description: p.desc,
      longDescription: p.longDesc,
      aboutExtra: p.aboutExtra || "",
      bestFor: p.bestFor || "",
      categoryId: categoryIdForProduct(p),
      type: p.type,
      color: p.color || "",
      dimensions: p.dimensions,
      unit: p.unit,
      price: p.price,
      priceTiers: p.priceTiers.length
        ? p.priceTiers
        : [{ quantity: "", price: "", perPiece: "" }],
      specs: p.specs.length ? p.specs : [{ label: "", value: "" }],
      faqs: p.faqs?.length ? p.faqs : [{ question: "", answer: "" }],
      images: p.images || [],
      isPublished: true,
    });
    setMode("form");
    setMessage(null);
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.set("file", file);
    fd.set("kind", "image");
    fd.set("productId", String(form.id || "temp"));
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  };

  const onImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setSaving(true);
    setMessage(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadFile(file));
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      setMessage({ type: "ok", text: `Uploaded ${urls.length} WebP image(s)` });
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Upload failed",
      });
    } finally {
      setSaving(false);
    }
  };

  const createCategoryInline = async () => {
    const name = newCatName.trim();
    if (!name) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "err", text: data.error || "Category create failed" });
      return;
    }
    setCategories((prev) => [...prev, data.category]);
    setForm((f) => ({ ...f, categoryId: data.category.id }));
    setNewCatName("");
    setMessage({ type: "ok", text: "Category added" });
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      setMessage({ type: "err", text: "Select a category" });
      return;
    }
    setSaving(true);
    setMessage(null);
    const payload = {
      name: form.name,
      displayName: form.displayName,
      description: form.description,
      longDescription: form.longDescription,
      aboutExtra: form.aboutExtra,
      bestFor: form.bestFor,
      categoryId: form.categoryId,
      type: form.type,
      color: form.color,
      dimensions: form.dimensions,
      unit: form.unit,
      price: form.price,
      priceTiers: form.priceTiers.filter((t) => t.quantity || t.price),
      specs: form.specs.filter((s) => s.label.trim() || s.value.trim()),
      faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      images: form.images,
      videoUrl: null,
      isPublished: form.isPublished,
    };
    const res = await fetch(
      form.id ? `/api/admin/products/${form.id}` : "/api/admin/products",
      {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage({ type: "err", text: data.error || "Save failed" });
      return;
    }
    setMessage({ type: "ok", text: "Product saved" });
    setMode("list");
    load();
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "err", text: data.error || "Delete failed" });
      return;
    }
    setMessage({ type: "ok", text: "Product deleted" });
    load();
  };

  if (mode === "form") {
    return (
      <div>
        <div className={styles.feedbackHero}>
          <div>
            <p className={styles.eyebrow}>Catalog</p>
            <h2 className={styles.feedbackTitle}>
              {form.id ? `Edit product #${form.id}` : "New product"}
            </h2>
          </div>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setMode("list")}
          >
            Back to list
          </button>
        </div>

        {message && (
          <p className={message.type === "ok" ? styles.profileOk : styles.profileErr}>
            {message.text}
          </p>
        )}

        <form className={styles.profileForm} onSubmit={onSave}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Display name</label>
            <input
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Short description</label>
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>About section (long description)</label>
            <textarea
              required
              rows={5}
              value={form.longDescription}
              onChange={(e) =>
                setForm({ ...form, longDescription: e.target.value })
              }
              placeholder="Main “About this product” paragraph shown on the product page"
            />
          </div>
          <div className={styles.formGroup}>
            <label>About — extra paragraph (optional)</label>
            <textarea
              rows={3}
              value={form.aboutExtra}
              onChange={(e) => setForm({ ...form, aboutExtra: e.target.value })}
              placeholder="Second About paragraph (leave blank for default store copy)"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Best for (Key features)</label>
            <input
              value={form.bestFor}
              onChange={(e) => setForm({ ...form, bestFor: e.target.value })}
              placeholder="e.g. Takeout, meal prep, catering, and food delivery brands"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Key feature specs</label>
            {form.specs.map((spec, i) => (
              <div key={i} className={styles.tierRow}>
                <input
                  placeholder="Label (e.g. Material)"
                  value={spec.label}
                  onChange={(e) => {
                    const specs = [...form.specs];
                    specs[i] = { ...spec, label: e.target.value };
                    setForm({ ...form, specs });
                  }}
                />
                <input
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => {
                    const specs = [...form.specs];
                    specs[i] = { ...spec, value: e.target.value };
                    setForm({ ...form, specs });
                  }}
                />
                <button
                  type="button"
                  className={styles.dangerBtn}
                  onClick={() =>
                    setForm({
                      ...form,
                      specs: form.specs.filter((_, idx) => idx !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() =>
                setForm({
                  ...form,
                  specs: [...form.specs, { label: "", value: "" }],
                })
              }
            >
              + Add spec
            </button>
          </div>
          <div className={styles.formGroup}>
            <label>FAQs (product page accordion)</label>
            <p className={styles.fieldHint}>
              Leave empty to use auto-generated FAQs. Add rows to override.
            </p>
            {form.faqs.map((faq, i) => (
              <div key={i} className={styles.faqEditor}>
                <input
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => {
                    const faqs = [...form.faqs];
                    faqs[i] = { ...faq, question: e.target.value };
                    setForm({ ...form, faqs });
                  }}
                />
                <textarea
                  rows={2}
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => {
                    const faqs = [...form.faqs];
                    faqs[i] = { ...faq, answer: e.target.value };
                    setForm({ ...form, faqs });
                  }}
                />
                <button
                  type="button"
                  className={styles.dangerBtn}
                  onClick={() =>
                    setForm({
                      ...form,
                      faqs: form.faqs.filter((_, idx) => idx !== i),
                    })
                  }
                >
                  Remove FAQ
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() =>
                setForm({
                  ...form,
                  faqs: [...form.faqs, { question: "", answer: "" }],
                })
              }
            >
              + Add FAQ
            </button>
          </div>
          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoryId: e.target.value ? Number(e.target.value) : "",
                })
              }
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className={styles.inlineAdd}>
              <input
                placeholder="New category name"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button type="button" className={styles.linkBtn} onClick={createCategoryInline}>
                Add category
              </button>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as "Disposable" | "Reusable",
                  })
                }
              >
                <option value="Disposable">Disposable</option>
                <option value="Reusable">Reusable</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Color</label>
              <input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Sizes / dimensions</label>
              <input
                required
                value={form.dimensions}
                onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Display price</label>
              <input
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Price tiers</label>
            {form.priceTiers.map((tier, i) => (
              <div key={i} className={styles.tierRow}>
                <input
                  placeholder="Quantity"
                  value={tier.quantity}
                  onChange={(e) => {
                    const priceTiers = [...form.priceTiers];
                    priceTiers[i] = { ...tier, quantity: e.target.value };
                    setForm({ ...form, priceTiers });
                  }}
                />
                <input
                  placeholder="Price"
                  value={tier.price}
                  onChange={(e) => {
                    const priceTiers = [...form.priceTiers];
                    priceTiers[i] = { ...tier, price: e.target.value };
                    setForm({ ...form, priceTiers });
                  }}
                />
                <input
                  placeholder="Per piece"
                  value={tier.perPiece}
                  onChange={(e) => {
                    const priceTiers = [...form.priceTiers];
                    priceTiers[i] = { ...tier, perPiece: e.target.value };
                    setForm({ ...form, priceTiers });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() =>
                setForm({
                  ...form,
                  priceTiers: [
                    ...form.priceTiers,
                    { quantity: "", price: "", perPiece: "" },
                  ],
                })
              }
            >
              + Add tier
            </button>
          </div>

          <div className={styles.formGroup}>
            <label>Images (auto WebP)</label>
            <p className={styles.fieldHint}>
              The first image is the store cover (product cards &amp; search). Use
              “Set as cover” to choose another.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onImages(e.target.files)}
            />
            <div className={styles.thumbRow}>
              {form.images.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className={`${styles.thumbItem} ${
                    index === 0 ? styles.thumbItemCover : ""
                  }`}
                >
                  {index === 0 && (
                    <span className={styles.coverBadge}>Cover</span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" />
                  <div className={styles.thumbActions}>
                    {index !== 0 && (
                      <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => {
                          const next = [...form.images];
                          const [picked] = next.splice(index, 1);
                          next.unshift(picked);
                          setForm({ ...form, images: next });
                        }}
                      >
                        Set as cover
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() =>
                        setForm({
                          ...form,
                          images: form.images.filter((_, i) => i !== index),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) =>
                setForm({ ...form, isPublished: e.target.checked })
              }
            />
            Published
          </label>

          <div className={styles.profileActions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? "Saving…" : "Save product"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.feedbackHero}>
        <div>
          <p className={styles.eyebrow}>Catalog</p>
          <h2 className={styles.feedbackTitle}>Products</h2>
        </div>
        <button type="button" className={styles.saveBtn} onClick={startCreate}>
          Add product
        </button>
      </div>

      {message && (
        <p className={message.type === "ok" ? styles.profileOk : styles.profileErr}>
          {message.text}
        </p>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className={styles.listFilters}>
            <label htmlFor="product-category-filter">Category</label>
            <select
              id="product-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className={styles.filterCount}>
              {filteredProducts.length === 0
                ? "0 of 0"
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                    currentPage * PAGE_SIZE,
                    filteredProducts.length
                  )} of ${filteredProducts.length}`}
            </span>
          </div>
          <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5}>No products in this category.</td>
                </tr>
              ) : (
                pagedProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0]}
                        alt=""
                        width={48}
                        height={48}
                        style={{ objectFit: "cover", borderRadius: 6 }}
                      />
                    ) : null}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => onDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {pageCount}
            </span>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={currentPage >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
