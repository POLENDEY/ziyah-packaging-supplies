"use client";

import Image, { type ImageProps } from "next/image";
import type { SyntheticEvent } from "react";
import styles from "./ProtectedProductImage.module.css";

type Props = ImageProps & {
  /** Extra class on the outer shield wrapper */
  wrapClassName?: string;
};

/**
 * Product image with light download deterrents (context menu, drag, CSS).
 * Note: browsers can still save images from network tools — this is not absolute DRM.
 */
export default function ProtectedProductImage({
  wrapClassName,
  className,
  alt,
  fill,
  ...imageProps
}: Props) {
  const prevent = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <span
      className={`${styles.shield} ${fill ? styles.shieldFill : styles.shieldIntrinsic}${
        wrapClassName ? ` ${wrapClassName}` : ""
      }`}
      onContextMenu={prevent}
      onDragStart={prevent}
    >
      <Image
        {...imageProps}
        fill={fill}
        alt={alt}
        className={`${styles.image}${className ? ` ${className}` : ""}`}
        draggable={false}
      />
      <span className={styles.guard} aria-hidden="true" />
    </span>
  );
}
