export async function rotateQuarterTurn(input: Buffer) {
  const sharp = (await import("sharp")).default;
  return sharp(input, { failOn: "none" }).rotate(90).webp({ quality: 90, effort: 4 }).toBuffer();
}

export async function imageToWebp(input: Buffer, contentType: string) {
  const sharp = (await import("sharp")).default;
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const withinLimit = (meta.width ?? 0) <= 2000 && (meta.height ?? 0) <= 2000;
  if (contentType === "image/webp" && withinLimit) return input;
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 90, effort: 4 })
    .toBuffer();
}
