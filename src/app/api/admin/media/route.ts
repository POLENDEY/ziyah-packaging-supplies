import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_IMAGE = 10 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;
const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const form = await request.formData();
    const file = form.get("file");
    const kind = String(form.get("kind") || "image");
    const productId = String(form.get("productId") || "temp");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }

    const sb = getSupabaseAdmin();
    const folder = `products/${productId}`;

    if (kind === "video") {
      if (!VIDEO_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "Unsupported video type" },
          { status: 400 }
        );
      }
      if (file.size > MAX_VIDEO) {
        return NextResponse.json(
          { error: "Video too large (max 50MB)" },
          { status: 400 }
        );
      }
      const ext =
        file.type === "video/webm"
          ? "webm"
          : file.type === "video/quicktime"
            ? "mov"
            : "mp4";
      const path = `${folder}/video-${crypto.randomUUID()}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      const { error } = await sb.storage
        .from("product-media")
        .upload(path, buf, { contentType: file.type, upsert: false });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      const { data } = sb.storage.from("product-media").getPublicUrl(path);
      return NextResponse.json({ url: data.publicUrl });
    }

    if (!IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type" },
        { status: 400 }
      );
    }
    if (file.size > MAX_IMAGE) {
      return NextResponse.json(
        { error: "Image too large (max 10MB)" },
        { status: 400 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    const webp = await sharp(input).rotate().webp({ quality: 80 }).toBuffer();
    const path = `${folder}/${crypto.randomUUID()}.webp`;
    const { error } = await sb.storage.from("product-media").upload(path, webp, {
      contentType: "image/webp",
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const { data } = sb.storage.from("product-media").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
