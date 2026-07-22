"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  IconClock,
  IconMapPin,
  IconPackage,
  IconPhone,
} from "../components/Icons";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/inquiry", { method: "POST", body: formData });

      if (response.redirected || response.ok) {
        setStatus({
          type: "success",
          message:
            "Thank you! Your inquiry has been sent. We'll get back to you soon.",
        });
        (e.target as HTMLFormElement).reset();
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
    <main className={styles.main}>
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>Contact Us</h1>
          <p>
            Have questions or need a custom quote? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            <div className={styles.infoCard}>
              <h2>Store Information</h2>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <IconMapPin size={20} />
                </span>
                <div>
                  <strong>Address</strong>
                  <p>
                    Unit 103, Doña Adela Apartment
                    <br />
                    2247 F.B.Harrison St
                    <br />
                    Pasay City, Metro Manila
                  </p>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <IconPhone size={20} />
                </span>
                <div>
                  <strong>Phone / Viber / SMS</strong>
                  <a href="tel:09668473419">0966 847 3419</a>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <IconClock size={20} />
                </span>
                <div>
                  <strong>Store Hours</strong>
                  <p>Open daily · Closes 6:30 PM</p>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <IconPackage size={20} />
                </span>
                <div>
                  <strong>Plus Code</strong>
                  <p>GXXV+R4 Pasay City, Metro Manila</p>
                </div>
              </div>
            </div>

            <div className={styles.formCard}>
              <h2>Send an Inquiry</h2>
              <p>Fill out the form and we&apos;ll respond within 24 hours.</p>

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
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="juan@example.com"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone / Viber</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="09xx xxx xxxx"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Inquiry Type</label>
                  <select id="subject" name="subject">
                    <option value="">Select an inquiry type</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="bulk-order">Bulk / Wholesale Order</option>
                    <option value="custom-packaging">Custom Packaging</option>
                    <option value="pricing">Pricing & Availability</option>
                    <option value="delivery">Delivery & Logistics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us what products you need, quantity, or any special requirements..."
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
