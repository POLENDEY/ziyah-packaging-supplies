"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import ProtectedProductImage from "@/app/components/ProtectedProductImage";
import { getProductImageAlt } from "@/data/products";
import styles from "./detail.module.css";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = slides[index] ?? slides[0];

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

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  const startVideo = () => setVideoPlaying(true);

  const blockSave = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <div className={styles.gallery} onContextMenu={blockSave}>
      <div className={styles.mainImage}>
        {active?.type === "video" ? (
          videoPlaying ? (
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
