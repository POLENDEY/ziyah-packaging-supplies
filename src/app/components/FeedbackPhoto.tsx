import Image from "next/image";

type Props = {
  src?: string | null;
  alt?: string;
  width: number;
  height: number;
  className?: string;
};

/** Normalize CMS photo paths and support any remote URL safely. */
export function resolveFeedbackPhoto(src?: string | null) {
  const value = String(src || "").trim();
  if (!value || value === "/" || value === "#") return "/logo.png";
  return value;
}

export function isRemotePhoto(src: string) {
  return /^https?:\/\//i.test(src);
}

/**
 * Local paths use next/image; remote URLs use a plain img so CMS can
 * accept any https photo without next.config host allowlisting.
 */
export default function FeedbackPhoto({
  src,
  alt = "",
  width,
  height,
  className,
}: Props) {
  const resolved = resolveFeedbackPhoto(src);

  if (isRemotePhoto(resolved)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ width, height, objectFit: "cover" }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
