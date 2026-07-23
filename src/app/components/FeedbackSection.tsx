"use client";

import { useEffect, useRef, useState } from "react";
import FeedbackPhoto from "./FeedbackPhoto";
import { reviews as fallbackReviews, type Review } from "@/data/reviews";
import styles from "./FeedbackSection.module.css";

function Stars({ rating, animate }: { rating: number; animate: boolean }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        return (
          <span
            key={i}
            className={`${styles.star} ${filled ? styles.starFilled : ""} ${
              animate && filled ? styles.starAnimate : ""
            }`}
            style={{ animationDelay: `${i * 90}ms` }}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function FeedbackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/feedback");
        const data = await res.json();
        if (!cancelled && Array.isArray(data) && data.length) {
          setReviews(data.slice(0, 4));
        }
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${visible ? styles.visible : ""}`}
      aria-labelledby="feedback-heading"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="feedback-heading">Customer Feedback</h2>
          <p>Real notes from food businesses who pack with Ziyah.</p>
        </div>

        <div className={styles.grid}>
          {reviews.map((review, index) => (
            <article
              key={review.id}
              className={styles.card}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={styles.top}>
                <div className={styles.photo}>
                  <FeedbackPhoto
                    src={review.photo}
                    alt={`${review.name} photo`}
                    width={56}
                    height={56}
                  />
                </div>
                <div>
                  <h3>{review.name}</h3>
                  <p className={styles.role}>{review.role}</p>
                </div>
              </div>
              <Stars rating={Number(review.rating) || 5} animate={visible} />
              <p className={styles.quote}>{review.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
