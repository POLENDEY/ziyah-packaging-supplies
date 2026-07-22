import styles from "./SocialLinks.module.css";
import { IconFacebook, IconMessenger, IconShopee } from "./Icons";
import { SITE } from "@/data/site";

type Props = {
  variant?: "light" | "dark";
  className?: string;
};

export default function SocialLinks({ variant = "light", className = "" }: Props) {
  return (
    <div className={`${styles.row} ${styles[variant]} ${className}`.trim()}>
      <a
        href={SITE.social.facebook.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label="Ziyah Packaging on Facebook"
      >
        <IconFacebook size={18} />
        <span>{SITE.social.facebook.label}</span>
      </a>
      <a
        href={SITE.social.messenger.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label="Chat with Ziyah Packaging on Messenger"
      >
        <IconMessenger size={18} />
        <span>{SITE.social.messenger.label}</span>
      </a>
      <a
        href={SITE.social.shopee.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label="Ziyah Packaging on Shopee"
      >
        <IconShopee size={18} />
        <span>{SITE.social.shopee.label}</span>
      </a>
    </div>
  );
}
