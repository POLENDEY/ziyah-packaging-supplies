import styles from "./BrandWordmark.module.css";

type Props = {
  /** White marks for dark backgrounds; black marks for light backgrounds */
  variant?: "onDark" | "onLight";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function BrandWordmark({
  variant = "onDark",
  size = "md",
  className = "",
}: Props) {
  return (
    <span
      className={`${styles.mark} ${styles[variant]} ${styles[size]} ${className}`.trim()}
      role="img"
      aria-label="Ziyah Packaging Supplies"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ZIYAH.svg" alt="" className={styles.ziyah} draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/PACKAGING.svg"
        alt=""
        className={styles.packaging}
        draggable={false}
      />
    </span>
  );
}
