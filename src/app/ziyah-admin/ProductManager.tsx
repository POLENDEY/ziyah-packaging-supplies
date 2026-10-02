"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./admin.module.css";
import type { Product, PriceTier, ProductFaq } from "@/data/products";
import type { DbCategory } from "@/lib/catalog/types";
import ProductColorFields from "./ProductColorFields";
import ProductLivePreview from "./ProductLivePreview";
import ImageBrushEditor, { canvasFromUrl, canvasToWebp } from "./ImageBrushEditor";
import {
  buildCutoutCanvases,
  cloneCanvas,
  finishWhiteCutout,
  prepareUploadImage,
  rotateCanvasKeepWatermark,
} from "./prepareUploadImage";
import { formToPreviewProduct } from "./previewProduct";

const PAGE_SIZE = 10;
const PREVIEW_KEY = "ziyah-admin-product-preview";

type GalleryChoice = { url: string; label: string };

function isPlaceholderImage(url: string) {
  return /dummy-post-square-1\.(webp|jpe?g|png)/i.test(url);
}

function moveListItem<T>(list: T[], from: number, to: number): T[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= list.length ||
    to >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [picked] = next.splice(from, 1);
  next.splice(to, 0, picked);
  return next;
}

function indexAfterMove(index: number, from: number, to: number) {
  if (index === from) return to;
  if (from < to && index > from && index <= to) return index - 1;
  if (to < from && index >= to && index < from) return index + 1;
  return index;
}

function choicesFromGallery(
  files: { url?: string; name?: string }[],
  products: { name?: string; images?: string[] }[]
): GalleryChoice[] {
  const seen = new Set<string>();
  const choices: GalleryChoice[] = [];
  const add = (url: string, label: string) => {
    if (!url || isPlaceholderImage(url) || seen.has(url)) return;
    seen.add(url);
    choices.push({ url, label });
  };
  for (const file of files) add(file.url || "", file.name || "Uploaded image");
  for (const product of products) {
    for (const url of product.images || []) add(url, product.name || "Product image");
  }
  return choices;
}

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
  colorHex: string;
  colorHexSecondary: string;
  variantGroup: string;
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
  colorHex: "",
  colorHexSecondary: "",
  variantGroup: "",
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
  const [showPreview, setShowPreview] = useState(false);
  const [formBaseline, setFormBaseline] = useState<FormState | null>(null);
  const [leavePromptOpen, setLeavePromptOpen] = useState(false);
  const [imageMode, setImageMode] = useState<"white" | "raw">("white");
  const [imagePreviewIndex, setImagePreviewIndex] = useState(0);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragFromRef = useRef<number | null>(null);
  const [rotatingIndex, setRotatingIndex] = useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryChoices, setGalleryChoices] = useState<GalleryChoice[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryPicked, setGalleryPicked] = useState<Set<string>>(new Set());
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const brushResolve = useRef<((canvas: HTMLCanvasElement | null) => void) | null>(null);
  const pendingFiles = useRef<Map<string, File>>(new Map());
  const [brushSession, setBrushSession] = useState<{
    work: HTMLCanvasElement;
    history: HTMLCanvasElement;
    eraseWhite: boolean;
    confirmLabel: string;
    cancelLabel: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    label: string;
    percent: number;
  } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREVIEW_KEY);
      if (stored === "1" || stored === "0") {
        setShowPreview(stored === "1");
        return;
      }
    } catch {
      /* ignore */
    }
    setShowPreview(window.matchMedia("(min-width: 900px)").matches);
  }, []);

  const setPreviewEnabled = (on: boolean) => {
    setShowPreview(on);
    try {
      localStorage.setItem(PREVIEW_KEY, on ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

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

  const existingVariantGroups = useMemo(() => {
    const groups = new Set<string>();
    for (const p of products) {
      if (p.variantGroup?.trim()) groups.add(p.variantGroup.trim());
    }
    return [...groups].sort();
  }, [products]);

  const selectedCategoryName =
    categories.find((c) => c.id === form.categoryId)?.name || "";

  const previewProduct = useMemo(
    () => formToPreviewProduct(form, selectedCategoryName),
    [form, selectedCategoryName]
  );

  const previewVariants = useMemo(() => {
    const group = form.variantGroup.trim();
    if (!group) return previewProduct.color ? [previewProduct] : [];
    const others = products.filter(
      (p) => p.variantGroup === group && p.id !== form.id
    );
    return [...others, previewProduct];
  }, [form.variantGroup, form.id, products, previewProduct]);

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

  const rememberLocalFile = (file: File) => {
    const url = URL.createObjectURL(file);
    pendingFiles.current.set(url, file);
    return url;
  };

  const forgetLocalFile = (url: string) => {
    if (!pendingFiles.current.has(url)) return;
    URL.revokeObjectURL(url);
    pendingFiles.current.delete(url);
  };

  const forgetAllLocalFiles = () => {
    for (const url of pendingFiles.current.keys()) forgetLocalFile(url);
  };

  const startCreate = () => {
    forgetAllLocalFiles();
    const next = emptyForm();
    setForm(next);
    setFormBaseline(next);
    setMode("form");
    setMessage(null);
    setLeavePromptOpen(false);
  };

  const startEdit = (p: Product) => {
    forgetAllLocalFiles();
    const next: FormState = {
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
      colorHex: p.colorHex || "",
      colorHexSecondary: p.colorHexSecondary || "",
      variantGroup: p.variantGroup || "",
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
    };
    setForm(next);
    setFormBaseline(next);
    setMode("form");
    setMessage(null);
    setLeavePromptOpen(false);
  };

  const postMedia = (
    file: File | null,
    onPercent: (percent: number) => void,
    sourceUrl?: string
  ) =>
    new Promise<string>((resolve, reject) => {
      const fd = new FormData();
      if (sourceUrl) fd.set("sourceUrl", sourceUrl);
      else if (file) fd.set("file", file);
      fd.set("kind", "image");
      fd.set("productId", String(form.id || "temp"));
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/media");
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        onPercent(Math.round((event.loaded / event.total) * 100));
      };
      xhr.onload = () => {
        let data: { url?: string; error?: string } = {};
        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          /* ignore */
        }
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          resolve(data.url);
          return;
        }
        reject(new Error(data.error || "Upload failed"));
      };
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(fd);
    });

  const onImages = async (files: File[]) => {
    if (!files.length) return;
    const list = files;
    setSaving(true);
    setMessage(null);
    setUploadProgress({
      label:
        list.length === 1
          ? `Preparing · ${list[0].name}`
          : `Preparing · ${list.length} images`,
      percent: 4,
    });
    try {
      const urls: string[] = [];
      for (let index = 0; index < list.length; index++) {
        const file = list[index];
        const prefix =
          list.length > 1 ? `Image ${index + 1} of ${list.length} · ` : "";
        let prepared: File;
        if (imageMode === "white") {
          const { cutout, history } = await buildCutoutCanvases(file, (update) => {
            setUploadProgress({
              label: `${prefix}${update.text}`,
              percent: Math.round(((index + update.percent / 100) / list.length) * 70),
            });
          });
          setUploadProgress({
            label: `${prefix}Brush what to keep or erase…`,
            percent: Math.round(((index + 0.75) / list.length) * 80),
          });
          const brushed = await openBrush(
            cloneCanvas(cutout),
            history,
            false,
            "Use this photo",
            "Keep automatic"
          );
          setUploadProgress({
            label: `${prefix}Leveling, sizing, and adding watermark…`,
            percent: Math.round(((index + 0.82) / list.length) * 80),
          });
          prepared = await finishWhiteCutout(brushed ?? cutout);
        } else {
          prepared = await prepareUploadImage(file, imageMode);
        }
        urls.push(rememberLocalFile(prepared));
      }
      setUploadProgress({ label: "Ready to save", percent: 100 });
      setImagePreviewIndex(form.images.length + urls.length - 1);
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      setMessage({
        type: "ok",
        text:
          urls.length === 1
            ? "Photo added. Click Save product to upload it."
            : `${urls.length} photos added. Click Save product to upload them.`,
      });
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Upload failed",
      });
    } finally {
      setSaving(false);
      window.setTimeout(() => setUploadProgress(null), 700);
    }
  };

  const openBrush = (
    work: HTMLCanvasElement,
    history: HTMLCanvasElement,
    eraseWhite: boolean,
    confirmLabel: string,
    cancelLabel: string
  ) =>
    new Promise<HTMLCanvasElement | null>((resolve) => {
      brushResolve.current = resolve;
      setBrushSession({ work, history, eraseWhite, confirmLabel, cancelLabel });
    });

  const closeBrush = (canvas: HTMLCanvasElement | null) => {
    const resolve = brushResolve.current;
    brushResolve.current = null;
    setBrushSession(null);
    resolve?.(canvas);
  };

  const brushImageAt = async (index: number) => {
    const src = form.images[index];
    if (!src || saving || rotatingIndex !== null) return;
    setSaving(true);
    setMessage(null);
    setImagePreviewIndex(index);
    try {
      const work = await canvasFromUrl(src);
      const edited = await openBrush(work, cloneCanvas(work), true, "Use this photo", "Cancel");
      if (!edited) return;
      const url = rememberLocalFile(await canvasToWebp(edited));
      forgetLocalFile(src);
      setForm((current) => {
        const images = [...current.images];
        if (!images[index]) return current;
        images[index] = url;
        return { ...current, images };
      });
      setMessage({ type: "ok", text: "Brush updated. Click Save product to upload it." });
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Could not brush that image",
      });
    } finally {
      setSaving(false);
      window.setTimeout(() => setUploadProgress(null), 700);
    }
  };

  const rotateImageAt = async (index: number) => {
    const src = form.images[index];
    if (!src || saving || rotatingIndex !== null) return;
    setRotatingIndex(index);
    setMessage(null);
    setImagePreviewIndex(index);
    try {
      const current = await canvasFromUrl(src);
      const turned = await rotateCanvasKeepWatermark(current);
      const url = rememberLocalFile(await canvasToWebp(turned));
      forgetLocalFile(src);
      setForm((formNow) => {
        const images = [...formNow.images];
        if (images[index] !== src) return formNow;
        images[index] = url;
        return { ...formNow, images };
      });
      setMessage({ type: "ok", text: "Rotated 90°. Click Save product to upload it." });
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Could not rotate that image",
      });
    } finally {
      setRotatingIndex(null);
    }
  };

  const openGalleryPicker = async () => {
    setGalleryOpen(true);
    setGalleryPicked(new Set());
    setGalleryError(null);
    setGalleryLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load gallery");
      setGalleryChoices(
        choicesFromGallery(
          Array.isArray(data.files) ? data.files : [],
          Array.isArray(data.products) ? data.products : []
        )
      );
    } catch (e) {
      setGalleryChoices([]);
      setGalleryError(e instanceof Error ? e.message : "Could not load gallery");
    } finally {
      setGalleryLoading(false);
    }
  };

  const addGalleryPicks = () => {
    const urls = [...galleryPicked].filter((url) => !form.images.includes(url));
    if (!urls.length) {
      setMessage({ type: "err", text: "Those photos are already on this product." });
      setGalleryOpen(false);
      return;
    }
    setForm((current) => ({ ...current, images: [...current.images, ...urls] }));
    setImagePreviewIndex(form.images.length + urls.length - 1);
    setMessage({
      type: "ok",
      text:
        urls.length === 1
          ? "Added 1 photo from the Gallery. Save the product to keep it."
          : `Added ${urls.length} photos from the Gallery. Save the product to keep them.`,
    });
    setGalleryOpen(false);
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

  const isDirty = useMemo(() => {
    if (!formBaseline) return false;
    return JSON.stringify(form) !== JSON.stringify(formBaseline);
  }, [form, formBaseline]);

  const goToList = () => {
    forgetAllLocalFiles();
    setLeavePromptOpen(false);
    setFormBaseline(null);
    setMode("list");
  };

  const requestBackToList = () => {
    if (!isDirty) {
      goToList();
      return;
    }
    setLeavePromptOpen(true);
  };

  const saveProduct = async (opts?: {
    asDraft?: boolean;
  }): Promise<boolean> => {
    if (!form.categoryId) {
      setMessage({ type: "err", text: "Select a category before saving" });
      return false;
    }
    if (!form.name.trim()) {
      setMessage({ type: "err", text: "Enter a title before saving" });
      return false;
    }
    setSaving(true);
    setMessage(null);
    const asDraft = opts?.asDraft === true;
    let images = form.images;
    try {
      const pending = form.images.filter((src) => pendingFiles.current.has(src));
      if (pending.length) {
        const uploaded: string[] = [];
        let done = 0;
        for (const src of form.images) {
          const file = pendingFiles.current.get(src);
          if (!file) {
            uploaded.push(src);
            continue;
          }
          done += 1;
          const label =
            pending.length === 1
              ? "Uploading image…"
              : `Uploading image ${done} of ${pending.length}…`;
          setUploadProgress({ label, percent: Math.round(((done - 1) / pending.length) * 100) });
          const url = await postMedia(file, (percent) => {
            const start = (done - 1) / pending.length;
            setUploadProgress({
              label,
              percent: Math.min(99, Math.round((start + percent / 100 / pending.length) * 100)),
            });
          });
          uploaded.push(url);
        }
        images = uploaded;
        setUploadProgress(null);
      }
    } catch (e) {
      setSaving(false);
      setUploadProgress(null);
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Could not upload images",
      });
      return false;
    }
    const payload = {
      name: form.name.trim() || "Untitled draft",
      displayName: form.displayName,
      description: form.description,
      longDescription: form.longDescription,
      aboutExtra: form.aboutExtra,
      bestFor: form.bestFor,
      categoryId: form.categoryId,
      type: form.type,
      color: form.color,
      colorHex: form.colorHex,
      colorHexSecondary: form.colorHexSecondary.trim() || null,
      variantGroup: form.variantGroup.trim() || null,
      dimensions: form.dimensions,
      unit: form.unit,
      price: form.price,
      priceTiers: form.priceTiers.filter((t) => t.quantity || t.price),
      specs: form.specs.filter((s) => s.label.trim() || s.value.trim()),
      faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      images,
      videoUrl: null,
      isPublished: asDraft ? false : form.isPublished,
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
      return false;
    }
    setMessage({
      type: "ok",
      text: asDraft ? "Draft saved" : "Product saved",
    });
    forgetAllLocalFiles();
    goToList();
    load();
    return true;
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProduct();
  };

  const onSaveDraftAndLeave = async () => {
    const ok = await saveProduct({ asDraft: true });
    if (!ok) setLeavePromptOpen(false);
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
          <div className={styles.formHeaderActions}>
            <label className={styles.previewToggle}>
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => setPreviewEnabled(e.target.checked)}
              />
              Show product preview
            </label>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={requestBackToList}
            >
              Back to list
            </button>
          </div>
        </div>

        {message && (
          <p className={message.type === "ok" ? styles.profileOk : styles.profileErr}>
            {message.text}
          </p>
        )}

        <div
          className={
            showPreview ? styles.formWithPreview : styles.formWithoutPreview
          }
        >
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

          <ProductColorFields
            value={{
              color: form.color,
              colorHex: form.colorHex,
              colorHexSecondary: form.colorHexSecondary,
              variantGroup: form.variantGroup,
            }}
            onChange={(next) => setForm({ ...form, ...next })}
            existingGroups={existingVariantGroups}
          />
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
              Drag a photo onto another to change the order. The first image is
              the store cover (product cards &amp; search). Use “Set as cover” to
              move one to the front. Rotate turns that one photo 90°
              clockwise. Brush restores a part you want to keep, or erases
              background and anything else. Upload from your computer, or choose
              photos already in the Gallery. New computer uploads are converted to WebP.
            </p>
            <div className={styles.imageModeRow} role="radiogroup" aria-label="Image upload style">
              <label className={styles.imageModeOption}>
                <input
                  type="radio"
                  name="imageMode"
                  checked={imageMode === "white"}
                  onChange={() => setImageMode("white")}
                />
                <span>
                  White background + logo watermark
                  <small>Removes the photo background, places the product on plain white, and adds a small logo at the bottom right.</small>
                </span>
              </label>
              <label className={styles.imageModeOption}>
                <input
                  type="radio"
                  name="imageMode"
                  checked={imageMode === "raw"}
                  onChange={() => setImageMode("raw")}
                />
                <span>
                  Upload as raw photo
                  <small>Keeps the original background. Still saved as WebP.</small>
                </span>
              </label>
            </div>
            <div className={styles.imageSourceRow}>
              <label className={styles.imageSourceComputer}>
                <span>From computer</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={saving}
                  onChange={(e) => {
                    const picked = Array.from(e.target.files ?? []);
                    e.target.value = "";
                    onImages(picked);
                  }}
                />
              </label>
              <button
                type="button"
                className={styles.secondaryBtn}
                disabled={saving}
                onClick={openGalleryPicker}
              >
                From Gallery
              </button>
            </div>
            {uploadProgress && (
              <div className={styles.uploadProgress}>
                <div className={styles.uploadProgressLabel}>
                  <span>{uploadProgress.label}</span>
                  <span>{uploadProgress.percent}%</span>
                </div>
                <div
                  className={styles.uploadProgressTrack}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={uploadProgress.percent}
                  aria-label={uploadProgress.label}
                >
                  <div
                    className={styles.uploadProgressBar}
                    style={{ width: `${uploadProgress.percent}%` }}
                  />
                </div>
              </div>
            )}
            {form.images.length > 0 && (
              <figure className={styles.imagePreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    form.images[
                      Math.min(imagePreviewIndex, form.images.length - 1)
                    ]
                  }
                  alt="Uploaded product preview"
                />
                <figcaption>
                  Preview
                  {Math.min(imagePreviewIndex, form.images.length - 1) === 0
                    ? " · Cover"
                    : ""}
                </figcaption>
              </figure>
            )}
            <div className={styles.thumbRow}>
              {form.images.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className={`${styles.thumbItem} ${
                    index === 0 ? styles.thumbItemCover : ""
                  } ${dragFrom === index ? styles.thumbDragging : ""} ${
                    dragOver === index && dragFrom !== index ? styles.thumbDropTarget : ""
                  }`}
                  onDragOver={(event) => {
                    if (dragFromRef.current === null) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    if (dragOver !== index) setDragOver(index);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const from = dragFromRef.current;
                    dragFromRef.current = null;
                    setDragFrom(null);
                    setDragOver(null);
                    if (from === null || from === index) return;
                    setForm((current) => ({
                      ...current,
                      images: moveListItem(current.images, from, index),
                    }));
                    setImagePreviewIndex((current) =>
                      indexAfterMove(current, from, index)
                    );
                  }}
                >
                  {index === 0 && (
                    <span className={styles.coverBadge}>Cover</span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <button
                    type="button"
                    className={styles.thumbPreviewBtn}
                    draggable
                    onClick={() => setImagePreviewIndex(index)}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", String(index));
                      dragFromRef.current = index;
                      setDragFrom(index);
                      setDragOver(index);
                    }}
                    onDragEnd={() => {
                      dragFromRef.current = null;
                      setDragFrom(null);
                      setDragOver(null);
                    }}
                    aria-label={
                      index === Math.min(imagePreviewIndex, form.images.length - 1)
                        ? "Showing this image in the preview. Drag to reorder."
                        : "Show this image in the preview. Drag to reorder."
                    }
                  >
                    <img src={src} alt="" draggable={false} />
                  </button>
                  <div className={styles.thumbActions}>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      disabled={saving || rotatingIndex !== null}
                      onClick={() => brushImageAt(index)}
                    >
                      Brush
                    </button>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      disabled={saving || rotatingIndex !== null}
                      onClick={() => rotateImageAt(index)}
                    >
                      {rotatingIndex === index ? "Rotating…" : "Rotate"}
                    </button>
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
                      onClick={() => {
                        forgetLocalFile(src);
                        setForm({
                          ...form,
                          images: form.images.filter((_, i) => i !== index),
                        });
                      }}
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
        {showPreview && (
          <ProductLivePreview
            product={previewProduct}
            variants={previewVariants}
          />
        )}
        </div>

        {brushSession && (
          <ImageBrushEditor
            work={brushSession.work}
            history={brushSession.history}
            eraseWhite={brushSession.eraseWhite}
            confirmLabel={brushSession.confirmLabel}
            cancelLabel={brushSession.cancelLabel}
            onCancel={() => closeBrush(null)}
            onDone={(canvas) => closeBrush(canvas)}
          />
        )}

        {galleryOpen && (
          <div
            className={styles.leaveOverlay}
            role="presentation"
            onClick={() => !galleryLoading && setGalleryOpen(false)}
          >
            <div
              className={`${styles.leaveDialog} ${styles.galleryPicker}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-picker-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="gallery-picker-title">Choose from Gallery</h3>
              <p>Select uploaded photos to add to this product. They stay as they already look.</p>
              {galleryError && <p className={styles.galleryErr}>{galleryError}</p>}
              {galleryLoading ? (
                <p className={styles.galleryEmpty}>Loading gallery…</p>
              ) : galleryChoices.length === 0 ? (
                <p className={styles.galleryEmpty}>No uploaded images in the Gallery yet.</p>
              ) : (
                <ul className={styles.galleryPickerGrid}>
                  {galleryChoices.map((choice) => {
                    const already = form.images.includes(choice.url);
                    const picked = galleryPicked.has(choice.url);
                    return (
                      <li key={choice.url}>
                        <button
                          type="button"
                          className={`${styles.galleryPickerItem} ${
                            picked ? styles.galleryPickerItemOn : ""
                          }`}
                          disabled={already}
                          aria-pressed={picked}
                          onClick={() => {
                            setGalleryPicked((current) => {
                              const next = new Set(current);
                              if (next.has(choice.url)) next.delete(choice.url);
                              else next.add(choice.url);
                              return next;
                            });
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={choice.url} alt="" />
                          <span>{already ? "Already added" : choice.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className={styles.galleryPickerActions}>
                <button
                  type="button"
                  className={styles.saveBtn}
                  disabled={galleryPicked.size === 0}
                  onClick={addGalleryPicks}
                >
                  {galleryPicked.size === 0
                    ? "Add selected"
                    : `Add ${galleryPicked.size} selected`}
                </button>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setGalleryOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {leavePromptOpen && (
          <div
            className={styles.leaveOverlay}
            role="presentation"
            onClick={() => !saving && setLeavePromptOpen(false)}
          >
            <div
              className={styles.leaveDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="leave-dialog-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="leave-dialog-title">Save your progress?</h3>
              <p>
                You have unsaved changes. Save as a draft to continue later, or
                leave without saving.
              </p>
              <div className={styles.leaveActions}>
                <button
                  type="button"
                  className={styles.saveBtn}
                  disabled={saving}
                  onClick={onSaveDraftAndLeave}
                >
                  {saving ? "Saving…" : "Save as draft"}
                </button>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  disabled={saving}
                  onClick={goToList}
                >
                  Continue to exit
                </button>
                <button
                  type="button"
                  className={styles.linkBtn}
                  disabled={saving}
                  onClick={() => setLeavePromptOpen(false)}
                >
                  Stay on form
                </button>
              </div>
            </div>
          </div>
        )}
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
