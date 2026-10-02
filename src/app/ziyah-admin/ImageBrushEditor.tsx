"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./admin.module.css";

type BrushMode = "restore" | "erase";

export async function canvasFromUrl(src: string) {
  const response = await fetch(src);
  if (!response.ok) throw new Error("Could not load that image");
  const bitmap = await createImageBitmap(await response.blob());
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not edit that image");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas;
}

export async function canvasToWebp(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Could not save the brushed image"))),
      "image/webp",
      0.92
    );
  });
  return new File([blob], "brushed.webp", { type: "image/webp" });
}

function stamp(
  work: HTMLCanvasElement,
  history: HTMLCanvasElement,
  x: number,
  y: number,
  radius: number,
  mode: BrushMode,
  eraseWhite: boolean
) {
  const ctx = work.getContext("2d", { willReadFrequently: true });
  const historyCtx = history.getContext("2d", { willReadFrequently: true });
  if (!ctx || !historyCtx) return;
  const r = Math.ceil(radius);
  const x0 = Math.max(0, Math.floor(x - r));
  const y0 = Math.max(0, Math.floor(y - r));
  const width = Math.min(work.width, Math.ceil(x + r)) - x0;
  const height = Math.min(work.height, Math.ceil(y + r)) - y0;
  if (width <= 0 || height <= 0) return;
  const image = ctx.getImageData(x0, y0, width, height);
  const source = mode === "restore" ? historyCtx.getImageData(x0, y0, width, height) : null;
  const data = image.data;
  const from = source?.data;
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const dist = Math.hypot(x0 + px - x, y0 + py - y);
      if (dist > radius) continue;
      const edge = dist / radius;
      const strength = edge > 0.72 ? (1 - edge) / 0.28 : 1;
      const i = (py * width + px) * 4;
      if (mode === "erase") {
        const target = eraseWhite ? [255, 255, 255, 255] : [255, 255, 255, 0];
        for (let c = 0; c < 4; c++) {
          data[i + c] = Math.round(data[i + c] * (1 - strength) + target[c] * strength);
        }
      } else if (from) {
        for (let c = 0; c < 4; c++) {
          data[i + c] = Math.round(data[i + c] * (1 - strength) + from[i + c] * strength);
        }
      }
    }
  }
  ctx.putImageData(image, x0, y0);
}

export default function ImageBrushEditor({
  work,
  history,
  eraseWhite,
  confirmLabel,
  cancelLabel,
  onCancel,
  onDone,
}: {
  work: HTMLCanvasElement;
  history: HTMLCanvasElement;
  eraseWhite: boolean;
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onDone: (canvas: HTMLCanvasElement) => void;
}) {
  const viewRef = useRef<HTMLCanvasElement>(null);
  const undoRef = useRef<ImageData[]>([]);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [mode, setMode] = useState<BrushMode>("restore");
  const [size, setSize] = useState(28);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const blit = () => {
    const view = viewRef.current;
    if (!view) return;
    if (view.width !== work.width || view.height !== work.height) {
      view.width = work.width;
      view.height = work.height;
    }
    const ctx = view.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, view.width, view.height);
    ctx.drawImage(work, 0, 0);
  };

  useEffect(() => {
    blit();
  }, [work]);

  const imagePoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * work.width,
      y: ((event.clientY - rect.top) / rect.height) * work.height,
      radius: (size / rect.width) * work.width,
    };
  };

  const paintTo = (x: number, y: number, radius: number) => {
    const from = last.current;
    const step = Math.max(1, radius / 4);
    if (!from) {
      stamp(work, history, x, y, radius, mode, eraseWhite);
    } else {
      const dist = Math.hypot(x - from.x, y - from.y);
      const count = Math.max(1, Math.ceil(dist / step));
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        stamp(
          work,
          history,
          from.x + (x - from.x) * t,
          from.y + (y - from.y) * t,
          radius,
          mode,
          eraseWhite
        );
      }
    }
    last.current = { x, y };
    blit();
  };

  return (
    <div className={styles.leaveOverlay} role="presentation">
      <div
        className={`${styles.leaveDialog} ${styles.brushDialog}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brush-title"
      >
        <h3 id="brush-title">Brush this photo</h3>
        <p>
          Restore paints the original back so that part is kept. Erase removes
          background or anything else you do not want.
        </p>
        <div className={styles.brushTools}>
          <button
            type="button"
            className={mode === "restore" ? styles.saveBtn : styles.secondaryBtn}
            onClick={() => setMode("restore")}
          >
            Restore
          </button>
          <button
            type="button"
            className={mode === "erase" ? styles.saveBtn : styles.secondaryBtn}
            onClick={() => setMode("erase")}
          >
            Erase
          </button>
          <label className={styles.brushSize}>
            Brush
            <input
              type="range"
              min={8}
              max={80}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => {
              const previous = undoRef.current.pop();
              const ctx = work.getContext("2d");
              if (!previous || !ctx) return;
              ctx.putImageData(previous, 0, 0);
              blit();
            }}
          >
            Undo
          </button>
        </div>
        <div className={styles.brushStage}>
          <canvas
            ref={viewRef}
            className={styles.brushCanvas}
            onPointerDown={(event) => {
              const ctx = work.getContext("2d");
              if (ctx) undoRef.current.push(ctx.getImageData(0, 0, work.width, work.height));
              if (undoRef.current.length > 8) undoRef.current.shift();
              drawing.current = true;
              last.current = null;
              event.currentTarget.setPointerCapture(event.pointerId);
              const point = imagePoint(event);
              paintTo(point.x, point.y, point.radius);
              setCursor({ x: event.clientX, y: event.clientY });
            }}
            onPointerMove={(event) => {
              setCursor({ x: event.clientX, y: event.clientY });
              if (!drawing.current) return;
              const point = imagePoint(event);
              paintTo(point.x, point.y, point.radius);
            }}
            onPointerUp={() => {
              drawing.current = false;
              last.current = null;
            }}
            onPointerLeave={() => {
              if (!drawing.current) setCursor(null);
            }}
          />
          {cursor && (
            <span
              className={styles.brushCursor}
              style={{
                width: size * 2,
                height: size * 2,
                left: cursor.x,
                top: cursor.y,
              }}
            />
          )}
        </div>
        <div className={styles.galleryPickerActions}>
          <button type="button" className={styles.saveBtn} onClick={() => onDone(work)}>
            {confirmLabel}
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
