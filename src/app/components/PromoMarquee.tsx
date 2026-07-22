import { PROMO_MESSAGES } from "@/data/site";
import styles from "./PromoMarquee.module.css";

export default function PromoMarquee() {
  const items = [...PROMO_MESSAGES, ...PROMO_MESSAGES];

  return (
    <div className={styles.wrap} aria-label="Promotions">
      <div className={styles.track}>
        {items.map((text, i) => (
          <span key={`${text}-${i}`} className={styles.item}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
