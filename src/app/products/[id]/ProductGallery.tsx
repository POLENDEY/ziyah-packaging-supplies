"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./detail.module.css";

type Props = {
  images: string[];
  name: string;
};

export default function ProductGallery({ images, name }: Props) {
  const gallery = images.length ? images : ["/dummy-post-square-1.jpg"];
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setIndex((i) => (i + 1) % gallery.length);

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <Image
          src={gallery[index]}
          alt={`${name} image ${index + 1}`}
          fill
          sizes="(max-width: 900px) 100vw, 520px"
          className={styles.image}
          priority
        />
      </div>

      {gallery.length > 1 && (
        <>
          <div className={styles.controls}>
            <button type="button" onClick={prev} aria-label="Previous image">
              ‹
            </button>
            <span>
              {index + 1} / {gallery.length}
            </span>
            <button type="button" onClick={next} aria-label="Next image">
              ›
            </button>
          </div>
          <div className={styles.thumbs}>
            {gallery.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={src} alt="" width={64} height={64} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
