import Image from "next/image";
import styles from "./page.module.css";

const MARQUEE_IMAGES = [
  "/about-page-marquee/IMG_0207.webp",
  "/about-page-marquee/IMG_0592.webp",
  "/about-page-marquee/IMG_1288.webp",
  "/about-page-marquee/IMG_2213.webp",
  "/about-page-marquee/IMG_2729.webp",
  "/about-page-marquee/IMG_2744.webp",
  "/about-page-marquee/IMG_2786.webp",
  "/about-page-marquee/IMG_5618.webp",
  "/about-page-marquee/IMG_5956.webp",
  "/about-page-marquee/IMG_5992.webp",
  "/about-page-marquee/IMG_6178.webp",
  "/about-page-marquee/IMG_6179.webp",
  "/about-page-marquee/IMG_6261.webp",
  "/about-page-marquee/IMG_6452.webp",
  "/about-page-marquee/IMG_6616.webp",
  "/about-page-marquee/IMG_6821.webp",
  "/about-page-marquee/IMG_7599.webp",
  "/about-page-marquee/IMG_8368.webp",
  "/about-page-marquee/IMG_8384.webp",
  "/about-page-marquee/IMG_8481.webp",
  "/about-page-marquee/IMG_8510.webp",
  "/about-page-marquee/IMG_8517.webp",
  "/about-page-marquee/IMG_8612.webp",
  "/about-page-marquee/IMG_8640.webp",
  "/about-page-marquee/IMG_9276.MP.webp",
  "/about-page-marquee/IMG_9300.webp",
  "/about-page-marquee/IMG_9474.MP.webp",
] as const;

const MID = Math.ceil(MARQUEE_IMAGES.length / 2);
const IMAGES_A = MARQUEE_IMAGES.slice(0, MID);
const IMAGES_B = MARQUEE_IMAGES.slice(MID);

const LOGOS_A = [
  "Shopee",
  "Facebook",
  "Messenger",
  "Pasay City",
  "Nationwide PH",
  "Wholesale",
];

const LOGOS_B = [
  "Food-Grade",
  "Bulk Ready",
  "Store Pickup",
  "Expert Help",
  "Daily Hours",
  "Ziyah",
];

function LogoTrack({
  items,
  className,
  reverse,
}: {
  items: string[];
  className: string;
  reverse?: boolean;
}) {
  const loop = [...items, ...items];
  return (
    <div
      className={`${className} ${reverse ? styles.logoMarqueeReverse : ""}`}
      aria-hidden="true"
    >
      <div className={styles.marqueeTrack}>
        {loop.map((label, i) => (
          <span key={`${label}-${i}`} className={styles.marqueeLogo}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ImageTrack({
  images,
  reverse,
}: {
  images: readonly string[];
  reverse?: boolean;
}) {
  const loop = [...images, ...images];
  return (
    <div
      className={`${styles.imageMarquee} ${reverse ? styles.imageMarqueeReverse : ""}`}
      aria-hidden="true"
    >
      <div className={styles.imageTrack}>
        {loop.map((src, i) => (
          <figure key={`${src}-${i}`} className={styles.marqueeFrame}>
            <Image
              src={src}
              alt=""
              width={240}
              height={300}
              className={styles.marqueeImg}
              sizes="(max-width: 768px) 160px, 240px"
              quality={70}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <span className={styles.marqueeMist} />
          </figure>
        ))}
      </div>
    </div>
  );
}

/** Slanted dual loop marquees with About page photos. */
export default function AboutMarqueeBands() {
  return (
    <section className={styles.marqueeStack} aria-label="Brand highlights">
      <div className={`${styles.marqueeBand} ${styles.marqueeBandUp}`}>
        <LogoTrack
          items={LOGOS_A}
          className={`${styles.logoMarquee} ${styles.logoMarqueeCoral}`}
          reverse
        />
        <ImageTrack images={IMAGES_A} />
      </div>

      <div className={`${styles.marqueeBand} ${styles.marqueeBandDown}`}>
        <LogoTrack
          items={LOGOS_B}
          className={`${styles.logoMarquee} ${styles.logoMarqueeDark}`}
        />
        <ImageTrack images={IMAGES_B} reverse />
      </div>
    </section>
  );
}
