"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { promoSlides } from "@/data/promos";
import styles from "./PromoBannerSlider.module.css";

const INTERVAL_MS = 5500;
const CLICK_THRESHOLD = 8;

export default function PromoBannerSlider() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    delta: number;
    width: number;
  }>({ active: false, startX: 0, delta: 0, width: 1 });
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
    }
  }, []);

  const goTo = useCallback((next: number) => {
    const len = promoSlides.length;
    setIndex(((next % len) + len) % len);
  }, []);

  useEffect(() => {
    if (!playing || promoSlides.length < 2 || dragging) return;
    const id = window.setInterval(() => goTo(index + 1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [playing, index, goTo, dragging]);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    const width = trackRef.current?.clientWidth || 1;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      delta: 0,
      width,
    };
    setDragging(true);
    setDragOffset(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const delta = e.clientX - dragRef.current.startX;
    dragRef.current.delta = delta;
    setDragOffset(delta);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const { delta, width } = dragRef.current;
    dragRef.current.active = false;
    setDragging(false);
    setDragOffset(0);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    if (Math.abs(delta) < CLICK_THRESHOLD) {
      setPlaying((v) => !v);
      return;
    }

    const threshold = width * 0.18;
    if (delta <= -threshold) goTo(index + 1);
    else if (delta >= threshold) goTo(index - 1);
  };

  const offsetPercent =
    -index * 100 + (dragOffset / (trackRef.current?.clientWidth || 1)) * 100;

  return (
    <section
      className={styles.section}
      aria-roledescription="carousel"
      aria-label="Promotional banners"
    >
      <div
        ref={trackRef}
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={styles.track}
          style={{
            transform: `translateX(${offsetPercent}%)`,
            transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {promoSlides.map((slide, i) => (
            <article
              key={slide.id}
              className={`${styles.slide} ${styles[slide.tone]}`}
              aria-hidden={i !== index}
            >
              <div className={styles.bgMedia} aria-hidden="true">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="100vw"
                  className={styles.bgImage}
                  draggable={false}
                  priority={i === 0}
                />
              </div>
              <div className={styles.fade} aria-hidden="true" />
              <div className={styles.copy}>
                <p className={styles.eyebrow}>Promotion</p>
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <Link href={slide.ctaHref} className={styles.cta}>
                  {slide.ctaLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.chrome} onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => goTo(index - 1)}
              aria-label="Previous promotion"
            >
              ‹
            </button>
            <div className={styles.dots} role="tablist" aria-label="Slide picker">
              {promoSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => goTo(index + 1)}
              aria-label="Next promotion"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
