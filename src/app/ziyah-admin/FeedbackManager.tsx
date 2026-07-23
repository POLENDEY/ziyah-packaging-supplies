"use client";

import { useEffect, useState } from "react";
import FeedbackPhoto from "../components/FeedbackPhoto";
import styles from "./admin.module.css";
import type { Review } from "@/data/reviews";
import { reviews as fallbackReviews } from "@/data/reviews";

const emptyCards = (): Review[] =>
  [1, 2, 3, 4].map((id) => ({
    id,
    name: "",
    role: "",
    rating: 5,
    photo: "/logo.png",
    quote: "",
  }));

export default function FeedbackManager() {
  const [cards, setCards] = useState<Review[]>(emptyCards());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/feedback");
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          const byId = new Map(data.map((item: Review) => [item.id, item]));
          setCards(
            [1, 2, 3, 4].map(
              (id) =>
                byId.get(id) ||
                fallbackReviews.find((r) => r.id === id) || {
                  id,
                  name: "",
                  role: "",
                  rating: 5,
                  photo: "/logo.png",
                  quote: "",
                }
            )
          );
        }
      } catch {
        setCards(fallbackReviews);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateCard = (id: number, patch: Partial<Review>) => {
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, ...patch } : card)));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cards }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save feedback");
      if (Array.isArray(data.items)) setCards(data.items);
      setMessage({ type: "ok", text: "Feedback cards saved. Home page will show the updates." });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to save";
      setMessage({ type: "err", text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.feedbackLoading}>
        <span className={styles.feedbackSpinner} aria-hidden="true" />
        Loading feedback cards…
      </div>
    );
  }

  return (
    <form className={styles.feedbackManager} onSubmit={save}>
      <div className={styles.feedbackHero}>
        <div>
          <p className={styles.feedbackEyebrow}>Home page · Social proof</p>
          <h2 className={styles.feedbackTitle}>Customer Feedback Cards</h2>
          <p className={styles.pageMeta}>
            Edit the 4 testimonials visitors see on the homepage. Changes go live after you save.
          </p>
        </div>
        <button type="submit" className={styles.feedbackSaveBtn} disabled={saving}>
          {saving ? "Saving…" : "Save Feedback"}
        </button>
      </div>

      {message && (
        <div
          className={
            message.type === "ok" ? styles.feedbackToastOk : styles.feedbackToastErr
          }
        >
          {message.text}
        </div>
      )}

      <div className={styles.feedbackGrid}>
        {cards.map((card) => (
          <article key={card.id} className={styles.feedbackCard}>
            <div className={styles.feedbackCardAccent} aria-hidden="true" />

            <header className={styles.feedbackCardHeader}>
              <div>
                <span className={styles.feedbackSlot}>Card {card.id}</span>
                <p className={styles.feedbackSlotHint}>Homepage slot</p>
              </div>
              <div className={styles.feedbackPreview}>
                <FeedbackPhoto
                  src={card.photo}
                  alt=""
                  width={52}
                  height={52}
                />
              </div>
            </header>

            <div className={styles.feedbackLivePreview}>
              <div className={styles.feedbackStars} aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < card.rating ? styles.feedbackStarOn : styles.feedbackStarOff}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className={styles.feedbackQuotePreview}>
                {card.quote || "Feedback quote preview will appear here…"}
              </p>
              <div className={styles.feedbackPreviewMeta}>
                <strong>{card.name || "Customer name"}</strong>
                <span>{card.role || "Role / business"}</span>
              </div>
            </div>

            <div className={styles.feedbackFields}>
              <label className={styles.feedbackField}>
                <span>Name</span>
                <input
                  type="text"
                  value={card.name}
                  onChange={(e) => updateCard(card.id, { name: e.target.value })}
                  required
                  placeholder="e.g. Maria Santos"
                />
              </label>

              <label className={styles.feedbackField}>
                <span>Role / business</span>
                <input
                  type="text"
                  value={card.role}
                  onChange={(e) => updateCard(card.id, { role: e.target.value })}
                  placeholder="e.g. Café owner · Makati"
                />
              </label>

              <div className={styles.feedbackField}>
                <span>Star rating</span>
                <div className={styles.feedbackStarPicker} role="group" aria-label={`Rating for card ${card.id}`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.feedbackStarBtn} ${
                        n <= card.rating ? styles.feedbackStarBtnActive : ""
                      }`}
                      onClick={() => updateCard(card.id, { rating: n })}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      aria-pressed={n <= card.rating}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <label className={styles.feedbackField}>
                <span>Photo URL / path</span>
                <input
                  type="text"
                  value={card.photo}
                  onChange={(e) => updateCard(card.id, { photo: e.target.value })}
                  placeholder="https://… or /logo.png"
                />
              </label>

              <label className={styles.feedbackField}>
                <span>Feedback quote</span>
                <textarea
                  rows={4}
                  value={card.quote}
                  onChange={(e) => updateCard(card.id, { quote: e.target.value })}
                  required
                  placeholder="Write the customer testimonial…"
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </form>
  );
}
