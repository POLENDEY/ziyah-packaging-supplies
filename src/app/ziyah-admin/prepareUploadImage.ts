"use client";

type Mode = "raw" | "white";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load watermark logo"));
    img.src = src;
  });
}

function hardenAlpha(data: Uint8ClampedArray, width: number, height: number) {
  const alpha = new Uint8Array(width * height);
  for (let p = 0, i = 0; p < alpha.length; p++, i += 4) {
    alpha[p] = data[i + 3];
  }

  const radius = 2;
  const eroded = new Uint8Array(alpha.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let min = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) {
          min = 0;
          continue;
        }
        const row = ny * width;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) {
            min = 0;
            continue;
          }
          const value = alpha[row + nx];
          if (value < min) min = value;
        }
      }
      eroded[y * width + x] = min;
    }
  }

  for (let p = 0; p < eroded.length; p++) {
    const a = eroded[p];
    const i = p * 4;
    const next = a >= 96 ? 255 : 0;
    data[i + 3] = next;
    if (next === 0) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }
}

async function resizeFile(file: File, maxEdge: number) {
  const bitmap = await createImageBitmap(file);
  const edge = Math.max(bitmap.width, bitmap.height);
  if (edge <= maxEdge) {
    bitmap.close();
    return file;
  }
  const scale = maxEdge / edge;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  bitmap.close();
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const resized = await createImageBitmap(file, {
    resizeWidth: width,
    resizeHeight: height,
    resizeQuality: "high",
  });
  ctx.drawImage(resized, 0, 0);
  resized.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Could not resize image"))),
      "image/png"
    );
  });
  return new File([blob], "upload.png", { type: "image/png" });
}

function opaqueBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number
) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] <= 24) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/** Smallest turn that lays a tilted product flat. Round items are left alone. */
function levelDegrees(data: Uint8ClampedArray, width: number, height: number) {
  let count = 0;
  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumYY = 0;
  let sumXY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < 40) continue;
      count++;
      sumX += x;
      sumY += y;
      sumXX += x * x;
      sumYY += y * y;
      sumXY += x * y;
    }
  }
  if (count < 80) return 0;
  const cx = sumX / count;
  const cy = sumY / count;
  const mu20 = sumXX / count - cx * cx;
  const mu02 = sumYY / count - cy * cy;
  const mu11 = sumXY / count - cx * cy;
  const trace = mu20 + mu02;
  const det = mu20 * mu02 - mu11 * mu11;
  const disc = Math.max(0, (trace * trace) / 4 - det);
  const major = trace / 2 + Math.sqrt(disc);
  const minor = trace / 2 - Math.sqrt(disc);
  if (minor <= 1 || major / minor < 1.18) return 0;
  let degrees = (0.5 * Math.atan2(2 * mu11, mu20 - mu02) * 180) / Math.PI;
  while (degrees > 45) degrees -= 90;
  while (degrees < -45) degrees += 90;
  if (Math.abs(degrees) < 0.8 || Math.abs(degrees) > 15) return 0;
  return -degrees;
}

function rotateCanvas(source: HTMLCanvasElement, degrees: number) {
  const rad = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const width = Math.ceil(source.width * cos + source.height * sin);
  const height = Math.ceil(source.width * sin + source.height * cos);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rad);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);
  return canvas;
}

function cropCanvas(
  source: HTMLCanvasElement,
  box: { x: number; y: number; w: number; h: number }
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, box.w);
  canvas.height = Math.max(1, box.h);
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.drawImage(source, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
  return canvas;
}


export type PrepareProgress = { text: string; percent: number };

async function canvasFromBlob(blob: Blob) {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not prepare image");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas;
}

export function cloneCanvas(source: HTMLCanvasElement) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not prepare image");
  ctx.drawImage(source, 0, 0);
  return canvas;
}

/** Cutout plus the original photo in the same frame, before the logo is added. */
export async function buildCutoutCanvases(
  file: File,
  onProgress?: (update: PrepareProgress) => void
) {
  onProgress?.({
    text: "Preparing image… first cutout can take a minute.",
    percent: 8,
  });
  const source = await resizeFile(file, 3200);
  onProgress?.({ text: "Removing background…", percent: 18 });
  const { removeBackground } = await import("@imgly/background-removal");
  const cutoutBlob = await removeBackground(source, {
    model: "isnet",
    device: "cpu",
    rescale: true,
    output: { format: "image/png", quality: 1 },
    progress: (key, current, total) => {
      if (key.startsWith("fetch")) {
        const pct = total ? current / total : 0;
        onProgress?.({
          text: "Downloading cutout model…",
          percent: Math.round(18 + pct * 32),
        });
      } else {
        onProgress?.({ text: "Removing background…", percent: 58 });
      }
    },
  });
  const cutout = await canvasFromBlob(cutoutBlob);
  const sourceCanvas = await canvasFromBlob(source);
  const history = document.createElement("canvas");
  history.width = cutout.width;
  history.height = cutout.height;
  const historyCtx = history.getContext("2d", { willReadFrequently: true });
  if (!historyCtx) throw new Error("Could not prepare image");
  historyCtx.drawImage(sourceCanvas, 0, 0, cutout.width, cutout.height);

  const ctx = cutout.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not clean image edges");
  const pixels = ctx.getImageData(0, 0, cutout.width, cutout.height);
  hardenAlpha(pixels.data, cutout.width, cutout.height);
  ctx.putImageData(pixels, 0, 0);
  return { cutout, history };
}

export async function finishWhiteCutout(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not clean image edges");
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const tilt = levelDegrees(pixels.data, canvas.width, canvas.height);
  const leveled = tilt ? rotateCanvas(canvas, tilt) : canvas;
  const leveledCtx = leveled.getContext("2d", { willReadFrequently: true });
  const leveledPixels = leveledCtx?.getImageData(
    0,
    0,
    leveled.width,
    leveled.height
  );
  const bounds = leveledPixels
    ? opaqueBounds(leveledPixels.data, leveled.width, leveled.height)
    : null;
  const product = bounds ? cropCanvas(leveled, bounds) : leveled;

  const size = 2000;
  const maxSide = size * 0.74;
  const fit = Math.min(maxSide / product.width, maxSide / product.height);
  const dw = product.width * fit;
  const dh = product.height * fit;
  const out = document.createElement("canvas");
  out.width = size;
  out.height = size;
  const outCtx = out.getContext("2d");
  if (!outCtx) throw new Error("Could not paint white background");
  outCtx.fillStyle = "#ffffff";
  outCtx.fillRect(0, 0, size, size);
  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = "high";
  const dx = (size - dw) / 2;
  const dy = (size - dh) / 2 - size * 0.02;
  outCtx.drawImage(product, dx, dy, dw, dh);

  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = "high";
  const logo = await loadImage("/logo.png");
  const logoSize = Math.round(size * 0.14);
  const margin = Math.round(size * 0.045);
  const logoX = size - margin - logoSize;
  const logoY = size - margin - logoSize;
  outCtx.save();
  outCtx.beginPath();
  outCtx.arc(
    logoX + logoSize / 2,
    logoY + logoSize / 2,
    logoSize / 2,
    0,
    Math.PI * 2
  );
  outCtx.clip();
  outCtx.drawImage(logo, logoX, logoY, logoSize, logoSize);
  outCtx.restore();

  const webp = await new Promise<Blob>((resolve, reject) => {
    out.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Could not encode image"))),
      "image/webp",
      0.92
    );
  });
  return new File([webp], "product-white.webp", { type: "image/webp" });
}

async function cutoutToWhiteWatermark(
  file: File,
  onProgress?: (update: PrepareProgress) => void
) {
  const { cutout } = await buildCutoutCanvases(file, onProgress);
  onProgress?.({ text: "Leveling, sizing, and adding watermark…", percent: 72 });
  return finishWhiteCutout(cutout);
}

export async function prepareUploadImage(
  file: File,
  mode: Mode,
  onProgress?: (update: PrepareProgress) => void
) {
  if (mode === "raw") return file;
  return cutoutToWhiteWatermark(file, onProgress);
}
