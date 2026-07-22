"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import {
  IconClock,
  IconMail,
  IconMapPin,
  IconMessenger,
  IconPackage,
  IconPhone,
} from "../components/Icons";
import SocialLinks from "../components/SocialLinks";
import { SITE } from "@/data/site";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const prefill = useMemo(() => {
    const product = searchParams.get("product") || "";
    const category = searchParams.get("category") || "";
    const price = searchParams.get("price") || "";
    const subject = searchParams.get("subject") || (product ? "product-inquiry" : "");
    const message = product
      ? [
          `Hi Ziyah Packaging,`,
          ``,
          `I'd like to inquire about:`,
          `Product: ${product}`,
          category ? `Category: ${category}` : null,
          price ? `Listed price: ${price}` : null,
          ``,
          `Please share availability, bulk options, and delivery details. Thank you!`,
        ]
          .filter(Boolean)
          .join("\n")
      : "";
    return { product, subject, message };
  }, [searchParams]);

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
            "Thank you! Your message was sent. We'll reply by email or phone soon.",
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
    <div className={styles.contentGrid}>
      <aside className={styles.infoCard}>
        <h2>Visit or Message Us</h2>
        <p className={styles.infoIntro}>
          Talk to our team about product availability, store pickup, or delivery options
          anywhere in the Philippines.
        </p>

        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>
            <IconMapPin size={20} />
          </span>
          <div>
            <strong>Address</strong>
            <p>
              {SITE.addressLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
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
            <a href={SITE.phoneHref}>{SITE.phone}</a>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>
            <IconMail size={20} />
          </span>
          <div>
            <strong>Email</strong>
            <a href={SITE.emailHref}>{SITE.email}</a>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>
            <IconMessenger size={20} />
          </span>
          <div>
            <strong>Messenger</strong>
            <a
              href={SITE.social.messenger.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat with us on Messenger
            </a>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>
            <IconClock size={20} />
          </span>
          <div>
            <strong>Store Hours</strong>
            <ul className={styles.hoursList}>
              {SITE.hours.map((row) => (
                <li key={row.day}>
                  <span>{row.day}</span>
                  <span>{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>
            <IconPackage size={20} />
          </span>
          <div>
            <strong>Plus Code</strong>
            <p>{SITE.plusCode}</p>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <strong className={styles.socialLabel}>Follow & Shop Online</strong>
          <SocialLinks variant="dark" />
        </div>
      </aside>

      <div className={styles.formCard}>
        <h2>Send a Message</h2>
        <p>
          Questions about a product, store hours, or delivery? Message us here. For bulk
          wholesale pricing, use our{" "}
          <a href="/quote" className={styles.inlineLink}>
            Get a Quote
          </a>{" "}
          page.
        </p>

        {prefill.product && (
          <div className={styles.prefillNote}>
            Inquiring about: <strong>{prefill.product}</strong>
          </div>
        )}

        {status && (
          <div
            className={`${styles.statusMsg} ${
              status.type === "success" ? styles.statusSuccess : styles.statusError
            }`}
          >
            {status.message}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} key={prefill.product || "blank"}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" required placeholder="Juan Dela Cruz" />
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
            <input type="tel" id="phone" name="phone" placeholder="09xx xxx xxxx" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Inquiry Type</label>
            <select id="subject" name="subject" defaultValue={prefill.subject}>
              <option value="">Select an inquiry type</option>
              <option value="product-inquiry">Product Inquiry</option>
              <option value="delivery">Delivery & Logistics</option>
              <option value="pricing">Pricing & Availability</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              defaultValue={prefill.message}
              placeholder="Tell us how we can help..."
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
