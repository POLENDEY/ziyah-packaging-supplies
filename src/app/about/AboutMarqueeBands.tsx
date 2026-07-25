import styles from "./page.module.css";

/** Site-wide placeholder — not catalog/pricelist product shots. */
const DUMMY = "/dummy-post-square-1.jpg";

const DUMMY_A = Array.from({ length: 8 }, () => DUMMY);
const DUMMY_B = Array.from({ length: 8 }, () => DUMMY);

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
  images: string[];
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            className={styles.marqueeImg}
            loading="lazy"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

/** Slanted dual loop marquees (Musso-style), using dummy images only. */
export default function AboutMarqueeBands() {
  return (
    <section className={styles.marqueeStack} aria-label="Brand highlights">
      <div className={`${styles.marqueeBand} ${styles.marqueeBandUp}`}>
        <LogoTrack
          items={LOGOS_A}
          className={`${styles.logoMarquee} ${styles.logoMarqueeCoral}`}
          reverse
        />
        <ImageTrack images={DUMMY_A} />
      </div>

      <div className={`${styles.marqueeBand} ${styles.marqueeBandDown}`}>
        <LogoTrack
          items={LOGOS_B}
          className={`${styles.logoMarquee} ${styles.logoMarqueeDark}`}
        />
        <ImageTrack images={DUMMY_B} reverse />
      </div>
    </section>
  );
}
