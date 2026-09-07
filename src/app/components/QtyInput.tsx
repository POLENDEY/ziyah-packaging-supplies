"use client";

import { useEffect, useState } from "react";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  "aria-label"?: string;
  className?: string;
};

/** Digits-only quantity field; commits clamped value on change/blur. */
export default function QtyInput({
  value,
  onChange,
  min = 1,
  max = 9999,
  "aria-label": ariaLabel = "Quantity",
  className,
}: Props) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n < min) {
      onChange(min);
      setDraft(String(min));
      return;
    }
    const clamped = Math.min(max, n);
    onChange(clamped);
    setDraft(String(clamped));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      aria-label={ariaLabel}
      className={className}
      value={draft}
      onChange={(e) => {
        const next = e.target.value.replace(/\D/g, "").slice(0, 4);
        setDraft(next);
        if (next === "") return;
        const n = parseInt(next, 10);
        if (!Number.isFinite(n)) return;
        onChange(Math.min(max, Math.max(min, n)));
      }}
      onBlur={() => commit(draft)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
    />
  );
}
