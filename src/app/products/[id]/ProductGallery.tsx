"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent,
} from "react";
import ProtectedProductImage from "@/app/components/ProtectedProductImage";
import { getProductImageAlt } from "@/data/products";
import styles from "./detail.module.css";

const CLICK_THRESHOLD = 8;

type Props = {
  images: string[];
  name: string;
  video?: string;
};

type Slide =
  | { type: "video"; src: string }
  | { type: "image"; src: string; alt: string };

export default function ProductGallery({ images, name, video }: Props) {
  const slides = useMemo<Slide[]>(() => {
    const imageList = images.length ? images : ["/dummy-post-square-1.jpg"];
    const list: Slide[] = [];
    if (video) list.push({ type: "video", src: video });
    imageList.forEach((src, i) =>
      list.push({
        type: "image",
        src,
        alt: getProductImageAlt(name, src, i),
      })
    );
    return list;
  }, [images, video, name]);

  const poster = images[0] || "/dummy-post-square-1.jpg";
  const posterAlt = getProductImageAlt(name, poster, 0);
  const [index, setIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    delta: number;
    width: number;
  }>({ active: false, startX: 0, delta: 0, width: 1 });
  const active = slides[index] ?? slides[0];
  const canSwipe = slides.length > 1;

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

  const goTo = useCallback(
    (nextIndex: number) => {
      const len = slides.length;
      if (len < 2) return;
      setIndex(((nextIndex % len) + len) % len);
    },
    [slides.length]
  );

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (!canSwipe) return;
    // While video plays, only the swipe overlay starts a drag (controls stay usable)
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
    setDragOffset(0);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    if (Math.abs(delta) < CLICK_THRESHOLD) return;

    suppressClickRef.current = true;
    const threshold = width * 0.18;
    if (delta <= -threshold) next();
    else if (delta >= threshold) prev();
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

  const swipeStyle =
    canSwipe && dragging
      ? {
          transform: `translateX(${dragOffset * 0.35}px)`,
          transition: "none",
        }
      : {
          transform: "translateX(0)",
          transition: dragging
            ? "none"
            : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        };

  return (
    <div className={styles.gallery} onContextMenu={blockSave}>
      <div
        ref={mainRef}
        className={`${styles.mainImage} ${canSwipe ? styles.mainImageSwipe : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={swipeStyle}
      >
        {active?.type === "video" ? (
          videoPlaying ? (
            <div className={styles.videoStage}>
              <video
                ref={videoRef}
                key={active.src}
                className={styles.video}
                src={active.src}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                playsInline
                poster={poster}
                onEnded={() => setVideoPlaying(false)}
                onContextMenu={blockSave}
              />
              {/* Swipe catcher over the video frame; bottom strip left for native controls */}
              <div
                className={styles.videoSwipeLayer}
                aria-hidden="true"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              />
            </div>
          ) : (
            <button
              type="button"
              className={styles.videoPoster}
              onClick={startVideo}
              aria-label={`Play video for ${name}`}
            >
              <ProtectedProductImage
                src={poster}
                alt={posterAlt}
                fill
                sizes="(max-width: 900px) 100vw, 520px"
                className={styles.image}
                priority
              />
              <span className={styles.playLarge} aria-hidden="true">
                ▶
              </span>
            </button>
          )
        ) : (
          <ProtectedProductImage
            src={active?.src || poster}
            alt={active?.type === "image" ? active.alt : posterAlt}
            fill
            sizes="(max-width: 900px) 100vw, 520px"
            className={styles.image}
            priority
          />
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
                onClick={() => setIndex(i)}
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
                      alt=""
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
                    alt=""
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
