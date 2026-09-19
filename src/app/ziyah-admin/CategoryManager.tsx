"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import type { DbCategory } from "@/lib/catalog/types";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (res.ok) setCategories(data.categories || []);
    else setMessage({ type: "err", text: data.error || "Failed to load" });
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const payload = {
      name,
      slug: slug || slugify(name),
      description,
      sortOrder: categories.length,
    };
    const res = await fetch(
      editingId
        ? `/api/admin/categories/${editingId}`
        : "/api/admin/categories",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "err", text: data.error || "Save failed" });
      return;
    }
    setMessage({ type: "ok", text: editingId ? "Category updated" : "Category created" });
    resetForm();
    load();
  };

  const onEdit = (cat: DbCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "err", text: data.error || "Delete failed" });
      return;
    }
    setMessage({ type: "ok", text: "Category deleted" });
    load();
  };

  return (
    <div>
      <div className={styles.feedbackHero}>
        <div>
          <p className={styles.eyebrow}>Catalog</p>
          <h2 className={styles.feedbackTitle}>Categories</h2>
        </div>
      </div>

      {message && (
        <p className={message.type === "ok" ? styles.profileOk : styles.profileErr}>
          {message.text}
        </p>
      )}

      <form className={styles.profileForm} onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!editingId) setSlug(slugify(e.target.value));
            }}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className={styles.profileActions}>
          <button type="submit" className={styles.saveBtn}>
            {editingId ? "Update category" : "Add category"}
          </button>
          {editingId && (
            <button type="button" className={styles.secondaryBtn} onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>{cat.slug}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => onEdit(cat)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => onDelete(cat.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
