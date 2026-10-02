"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./admin.module.css";

type BrushMode = "restore" | "erase" | "pen";
type Point = { x: number; y: number };

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

function pointInPolygon(x: number, y: number, points: Point[]) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;
    const crosses = yi > y !== yj > y;
    if (!crosses) continue;
    const edge = ((xj - xi) * (y - yi)) / (yj - yi || 0.00001) + xi;
    if (x < edge) inside = !inside;
  }
  return inside;
}

function stamp(
  work: HTMLCanvasElement,
  history: HTMLCanvasElement,
  x: number,
  y: number,
  radius: number,
  mode: Exclude<BrushMode, "pen">,
  eraseWhite: boolean,
  selection: Point[] | null
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
      if (selection && !pointInPolygon(x0 + px, y0 + py, selection)) continue;
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
  const [mode, setMode] = useState<BrushMode>("pen");
  const [size, setSize] = useState(28);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [penClosed, setPenClosed] = useState(false);
  const [penCount, setPenCount] = useState(0);
  const pointsRef = useRef<Point[]>([]);
  const closedRef = useRef(false);

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
    const points = pointsRef.current;
    if (!points.length) return;
    ctx.save();
    ctx.lineWidth = Math.max(2, work.width / 500);
    ctx.strokeStyle = "#5b21b6";
    ctx.fillStyle = "rgba(91, 33, 182, 0.16)";
    ctx.setLineDash([Math.max(8, work.width / 180), Math.max(6, work.width / 240)]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) ctx.lineTo(point.x, point.y);
    if (closedRef.current) ctx.closePath();
    if (closedRef.current) ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    for (const point of points) {
      ctx.beginPath();
      ctx.fillStyle = "#5b21b6";
      ctx.arc(point.x, point.y, Math.max(4, work.width / 280), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const selection = () => (closedRef.current && pointsRef.current.length >= 3 ? pointsRef.current : null);

  const paintMode = (): Exclude<BrushMode, "pen"> => (mode === "erase" ? "erase" : "restore");

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
      stamp(work, history, x, y, radius, paintMode(), eraseWhite, selection());
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
          paintMode(),
          eraseWhite,
          selection()
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
          Use the pen to click around the portion you want. Close the shape, then
          Restore or Erase only inside that selection. Restore paints the original
          back. Erase removes background or anything else.
        </p>
        <div className={styles.brushTools}>
          <button
            type="button"
            className={mode === "pen" ? styles.saveBtn : styles.secondaryBtn}
            onClick={() => setMode("pen")}
          >
            Pen
          </button>
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
            className={styles.secondaryBtn}
            disabled={!penClosed || mode === "pen"}
            onClick={() => {
              const points = pointsRef.current;
              if (!closedRef.current || points.length < 3) return;
              const ctx = work.getContext("2d", { willReadFrequently: true });
              const historyCtx = history.getContext("2d", { willReadFrequently: true });
              if (!ctx || !historyCtx) return;
              undoRef.current.push(ctx.getImageData(0, 0, work.width, work.height));
              if (undoRef.current.length > 8) undoRef.current.shift();
              const image = ctx.getImageData(0, 0, work.width, work.height);
              const source =
                paintMode() === "restore"
                  ? historyCtx.getImageData(0, 0, work.width, work.height)
                  : null;
              const data = image.data;
              const from = source?.data;
              let minX = work.width;
              let minY = work.height;
              let maxX = 0;
              let maxY = 0;
              for (const point of points) {
                minX = Math.min(minX, point.x);
                minY = Math.min(minY, point.y);
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
              }
              const xStart = Math.max(0, Math.floor(minX));
              const yStart = Math.max(0, Math.floor(minY));
              const xEnd = Math.min(work.width - 1, Math.ceil(maxX));
              const yEnd = Math.min(work.height - 1, Math.ceil(maxY));
              const target = eraseWhite ? [255, 255, 255, 255] : [255, 255, 255, 0];
              for (let y = yStart; y <= yEnd; y++) {
                for (let x = xStart; x <= xEnd; x++) {
                  if (!pointInPolygon(x, y, points)) continue;
                  const i = (y * work.width + x) * 4;
                  if (paintMode() === "erase") {
                    for (let c = 0; c < 4; c++) data[i + c] = target[c];
                  } else if (from) {
                    for (let c = 0; c < 4; c++) data[i + c] = from[i + c];
                  }
                }
              }
              ctx.putImageData(image, 0, 0);
              blit();
            }}
          >
            Apply to selection
          </button>
          <button
            type="button"
            className={styles.linkBtn}
            disabled={penCount === 0}
            onClick={() => {
              pointsRef.current = [];
              closedRef.current = false;
              setPenClosed(false);
              setPenCount(0);
              blit();
            }}
          >
            Clear pen
          </button>
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
            className={`${styles.brushCanvas} ${mode === "pen" ? styles.brushCanvasPen : ""}`}
            onPointerDown={(event) => {
              const point = imagePoint(event);
              if (mode === "pen") {
                if (closedRef.current) return;
                const points = pointsRef.current;
                const closeDistance = (16 / event.currentTarget.getBoundingClientRect().width) * work.width;
                if (
                  points.length >= 3 &&
                  Math.hypot(point.x - points[0].x, point.y - points[0].y) <= closeDistance
                ) {
                  closedRef.current = true;
                  setPenClosed(true);
                  blit();
                  return;
                }
                pointsRef.current = [...points, { x: point.x, y: point.y }];
                setPenCount(pointsRef.current.length);
                blit();
                return;
              }
              const ctx = work.getContext("2d");
              if (ctx) undoRef.current.push(ctx.getImageData(0, 0, work.width, work.height));
              if (undoRef.current.length > 8) undoRef.current.shift();
              drawing.current = true;
              last.current = null;
              event.currentTarget.setPointerCapture(event.pointerId);
              paintTo(point.x, point.y, point.radius);
              setCursor({ x: event.clientX, y: event.clientY });
            }}
            onPointerMove={(event) => {
              if (mode === "pen") {
                setCursor(null);
                return;
              }
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
          {cursor && mode !== "pen" && (
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
