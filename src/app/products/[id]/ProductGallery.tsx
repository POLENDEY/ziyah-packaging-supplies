"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent,
  type TransitionEvent,
} from "react";
import ProtectedProductImage from "@/app/components/ProtectedProductImage";
import { getProductImageAlt } from "@/data/products";
import styles from "./detail.module.css";

const CLICK_THRESHOLD = 8;
const SWIPE_RATIO = 0.18;

type Props = {
  images: string[];
  name: string;
  video?: string;
  category?: string;
  color?: string;
  dimensions?: string;
};

type Slide =
  | { type: "video"; src: string }
  | { type: "image"; src: string; alt: string };

type AnimDir = "prev" | "next" | null;

export default function ProductGallery({
  images,
  name,
  video,
  category,
  color,
  dimensions,
}: Props) {
  const imageMeta = useMemo(
    () => ({ category, color, dimensions }),
    [category, color, dimensions]
  );
  const slides = useMemo<Slide[]>(() => {
    const imageList = images.length ? images : ["/dummy-post-square-1.jpg"];
    const list: Slide[] = [];
    if (video) list.push({ type: "video", src: video });
    imageList.forEach((src, i) =>
      list.push({
        type: "image",
        src,
        alt: getProductImageAlt(name, src, i, imageMeta),
      })
    );
    return list;
  }, [images, video, name, imageMeta]);

  const poster = images[0] || "/dummy-post-square-1.jpg";
  const posterAlt = getProductImageAlt(name, poster, 0, imageMeta);
  const [index, setIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [animDir, setAnimDir] = useState<AnimDir>(null);
  const [snap, setSnap] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const animatingRef = useRef(false);
  const pendingIndexRef = useRef<number | null>(null);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    delta: number;
    width: number;
  }>({ active: false, startX: 0, delta: 0, width: 1 });

  const canSwipe = slides.length > 1;
  const len = slides.length;

  const slideAt = useCallback(
    (i: number) => slides[((i % len) + len) % len],
    [slides, len]
  );

  const prevSlide = canSwipe ? slideAt(index - 1) : null;
  const currSlide = slides[index] ?? slides[0];
  const nextSlide = canSwipe ? slideAt(index + 1) : null;

  useEffect(() => {
    setVideoPlaying(false);
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, [index]);

  useEffect(() => {
    if (!videoPlaying) return;
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {});
  }, [videoPlaying]);

  const finishAnimation = useCallback(
    (dir: "prev" | "next") => {
      const pending = pendingIndexRef.current;
      pendingIndexRef.current = null;

      setSnap(true);
      if (pending !== null) {
        setIndex(((pending % len) + len) % len);
      } else {
        setIndex((i) =>
          dir === "next" ? (i + 1) % len : (i - 1 + len) % len
        );
      }
      setAnimDir(null);
      setDragOffset(0);
      animatingRef.current = false;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSnap(false));
      });
    },
    [len]
  );

  const startSlide = useCallback(
    (dir: "prev" | "next", targetIndex?: number) => {
      if (!canSwipe || animatingRef.current) return;
      animatingRef.current = true;
      pendingIndexRef.current =
        typeof targetIndex === "number" ? targetIndex : null;
      setDragging(false);
      setDragOffset(0);
      setAnimDir(dir);
    },
    [canSwipe]
  );

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!canSwipe || animatingRef.current) return;
      const target = ((nextIndex % len) + len) % len;
      if (target === index) return;

      const forwardDist = (target - index + len) % len;
      const backwardDist = (index - target + len) % len;
      const dir: "prev" | "next" =
        forwardDist <= backwardDist ? "next" : "prev";
      startSlide(dir, target);
    },
    [canSwipe, index, len, startSlide]
  );

  const prev = () => startSlide("prev");
  const next = () => startSlide("next");

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (!canSwipe || animatingRef.current) return;
    const fromSwipeLayer = (e.currentTarget as HTMLElement).classList.contains(
      styles.videoSwipeLayer
    );
    if (videoPlaying && !fromSwipeLayer) return;

    const width = mainRef.current?.clientWidth || 1;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      delta: 0,
      width,
    };
    suppressClickRef.current = false;
    setDragging(true);
    setDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (!dragRef.current.active) return;
    const delta = e.clientX - dragRef.current.startX;
    dragRef.current.delta = delta;
    setDragOffset(delta);
  };

  const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (!dragRef.current.active) return;
    const { delta, width } = dragRef.current;
    dragRef.current.active = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    if (Math.abs(delta) < CLICK_THRESHOLD) {
      setDragOffset(0);
      return;
    }

    suppressClickRef.current = true;
    const threshold = width * SWIPE_RATIO;
    if (delta <= -threshold) {
      animatingRef.current = true;
      setAnimDir("next");
      setDragOffset(0);
    } else if (delta >= threshold) {
      animatingRef.current = true;
      setAnimDir("prev");
      setDragOffset(0);
    } else {
      setDragOffset(0);
    }
  };

  const onTrackTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    if (animDir === "next" || animDir === "prev") {
      finishAnimation(animDir);
    }
  };

  const startVideo = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setVideoPlaying(true);
  };

  const blockSave = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const trackStyle: CSSProperties = (() => {
    if (!canSwipe) return {};

    let x = "translateX(-100%)";
    if (animDir === "next") x = "translateX(-200%)";
    else if (animDir === "prev") x = "translateX(0%)";
    else if (dragging) x = `translateX(calc(-100% + ${dragOffset}px))`;

    const transition =
      snap || dragging || !canSwipe
        ? "none"
        : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";

    return { transform: x, transition };
  })();

  const renderSlide = (slide: Slide, key: string, isCurrent: boolean) => {
    if (slide.type === "video") {
      if (isCurrent && videoPlaying) {
        return (
          <div key={key} className={styles.slide}>
            <div className={styles.videoStage}>
              <video
                ref={videoRef}
                className={styles.video}
                src={slide.src}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                playsInline
                poster={poster}
                onEnded={() => setVideoPlaying(false)}
                onContextMenu={blockSave}
              />
              <div
                className={styles.videoSwipeLayer}
                aria-hidden="true"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              />
            </div>
          </div>
        );
      }

      return (
        <div key={key} className={styles.slide}>
          <button
            type="button"
            className={styles.videoPoster}
            onClick={isCurrent ? startVideo : undefined}
            tabIndex={isCurrent ? 0 : -1}
            aria-label={`Play video for ${name}`}
            aria-hidden={!isCurrent}
          >
            <ProtectedProductImage
              src={poster}
              alt={posterAlt}
              fill
              sizes="(max-width: 900px) 100vw, 520px"
              className={styles.image}
              priority={isCurrent}
            />
            <span className={styles.playLarge} aria-hidden="true">
              ▶
            </span>
          </button>
        </div>
      );
    }

    return (
      <div key={key} className={styles.slide}>
        <ProtectedProductImage
          src={slide.src}
          alt={slide.alt}
          fill
          sizes="(max-width: 900px) 100vw, 520px"
          className={styles.image}
          priority={isCurrent}
        />
      </div>
    );
  };

  return (
    <div className={styles.gallery} onContextMenu={blockSave}>
      <div
        ref={mainRef}
        className={`${styles.mainImage} ${canSwipe ? styles.mainImageSwipe : ""}`}
        onPointerDown={canSwipe && !videoPlaying ? onPointerDown : undefined}
        onPointerMove={canSwipe && !videoPlaying ? onPointerMove : undefined}
        onPointerUp={canSwipe && !videoPlaying ? endDrag : undefined}
        onPointerCancel={canSwipe && !videoPlaying ? endDrag : undefined}
      >
        {canSwipe && prevSlide && nextSlide ? (
          <div
            className={styles.slideTrack}
            style={trackStyle}
            onTransitionEnd={onTrackTransitionEnd}
          >
            {renderSlide(prevSlide, `prev-${index}`, false)}
            {renderSlide(currSlide, `curr-${index}`, true)}
            {renderSlide(nextSlide, `next-${index}`, false)}
          </div>
        ) : (
          renderSlide(currSlide, `only-${index}`, true)
        )}
      </div>

      {slides.length > 1 && (
        <>
          <div className={styles.controls}>
            <button type="button" onClick={prev} aria-label="Previous slide">
              ‹
            </button>
            <span>
              {index + 1} / {slides.length}
            </span>
            <button type="button" onClick={next} aria-label="Next slide">
              ›
            </button>
          </div>
          <div className={styles.thumbs}>
            {slides.map((slide, i) => (
              <button
                key={`${slide.type}-${slide.src}-${i}`}
                type="button"
                className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
                onClick={() => goTo(i)}
                aria-label={
                  slide.type === "video"
                    ? "View product video"
                    : `View ${slide.alt}`
                }
              >
                {slide.type === "video" ? (
                  <span className={styles.videoThumb}>
                    <ProtectedProductImage
                      src={poster}
                      alt={posterAlt}
                      width={64}
                      height={64}
                    />
                    <span className={styles.playBadge} aria-hidden="true">
                      ▶
                    </span>
                  </span>
                ) : (
                  <ProtectedProductImage
                    src={slide.src}
                    alt={slide.alt}
                    width={64}
                    height={64}
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
