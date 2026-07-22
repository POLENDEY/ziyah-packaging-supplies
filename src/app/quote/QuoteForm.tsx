"use client";

import { useState } from "react";
import styles from "../contact/page.module.css";
import quoteStyles from "./page.module.css";
import { SITE } from "@/data/site";

export default function QuoteForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const productsNeeded = String(formData.get("products") || "");
    const quantity = String(formData.get("quantity") || "");
    const city = String(formData.get("city") || "");
    const details = String(formData.get("details") || "");

    const message = [
      "Wholesale / bulk quote request",
      "",
      `Products needed: ${productsNeeded}`,
      `Estimated quantity: ${quantity}`,
      `Delivery city/area: ${city}`,
      "",
      "Additional details:",
      details || "N/A",
    ].join("\n");

    formData.set("subject", "bulk-order");
    formData.set("message", message);
    formData.delete("products");
    formData.delete("quantity");
    formData.delete("city");
    formData.delete("details");

    try {
      const response = await fetch("/api/inquiry", { method: "POST", body: formData });
      if (response.redirected || response.ok) {
        setStatus({
          type: "success",
          message:
            "Quote request received! Our team will prepare pricing and reach out shortly.",
        });
        form.reset();
      } else {
        const result = await response.json();
        throw new Error(result.error || "Failed to submit");
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={quoteStyles.quoteGrid}>
      <aside className={quoteStyles.benefits}>
        <h2>Why request a quote?</h2>
        <ul>
          <li>Volume discounts for restaurants, commissaries, and resellers</li>
          <li>Help matching the right trays, lids, and films to your menu</li>
          <li>Delivery coordination {SITE.serviceArea.toLowerCase()}</li>
          <li>Fast follow-up from our Pasay City packaging specialists</li>
        </ul>
        <div className={quoteStyles.benefitNote}>
          <strong>Prefer a quick chat?</strong>
          <p>
            Call / Viber {SITE.phone} or email{" "}
            <a href={SITE.emailHref}>{SITE.email}</a>
          </p>
        </div>
      </aside>

      <div className={styles.formCard}>
        <h2>Request a Wholesale Quote</h2>
        <p>
          Tell us what you need and your estimated volume. We&apos;ll respond with
          availability and competitive bulk pricing.
        </p>

        {status && (
          <div
            className={`${styles.statusMsg} ${
              status.type === "success" ? styles.statusSuccess : styles.statusError
            }`}
          >
            {status.message}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Business / Contact Name *</label>
              <input type="text" id="name" name="name" required placeholder="Your name or business" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" name="email" required placeholder="orders@yourbiz.com" />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone / Viber *</label>
            <input type="tel" id="phone" name="phone" required placeholder="09xx xxx xxxx" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="products">Products Needed *</label>
            <input
              type="text"
              id="products"
              name="products"
              required
              placeholder="e.g. 3-compartment bento, 16oz cups, cling wrap"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="quantity">Estimated Quantity *</label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                required
                placeholder="e.g. 500 pcs / week"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city">Delivery City / Area *</label>
              <input
                type="text"
                id="city"
                name="city"
                required
                placeholder="e.g. Cebu City, Davao, Quezon City"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="details">Additional Details</label>
            <textarea
              id="details"
              name="details"
              rows={4}
              placeholder="Timeline, preferred materials, lid needs, branding notes..."
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Sending..." : "Get My Quote"}
          </button>
        </form>
      </div>
    </div>
  );
}
