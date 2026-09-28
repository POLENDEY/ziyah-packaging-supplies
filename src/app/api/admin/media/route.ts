import { NextResponse } from "next/server";
import sharp from "sharp";
import { Client } from "pg";
import { requireAdmin } from "@/lib/adminAuth";
import { getAllProductsAdmin } from "@/lib/catalog/queries";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_IMAGE = 20 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;
const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const IMAGE_EXT = /\.(webp|png|jpe?g|gif)$/i;
const BUCKET = "product-media";

type StorageItem = {
  name: string;
  id: string | null;
  created_at: string | null;
  metadata: { size?: number; contentLength?: number } | null;
};

async function listImages(
  sb: ReturnType<typeof getSupabaseAdmin>,
  prefix = ""
): Promise<
  { path: string; name: string; size: number; createdAt: string | null; url: string }[]
> {
  const found: {
    path: string;
    name: string;
    size: number;
    createdAt: string | null;
    url: string;
  }[] = [];
  let offset = 0;
  const limit = 100;

  for (;;) {
    const { data, error } = await sb.storage.from(BUCKET).list(prefix, {
      limit,
      offset,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) throw new Error(error.message);
    const items = (data || []) as StorageItem[];
    if (!items.length) break;

    for (const item of items) {
      if (!item.name || item.name.startsWith(".")) continue;
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      const isFile = item.id != null || IMAGE_EXT.test(item.name);
      if (!isFile) {
        found.push(...(await listImages(sb, path)));
        continue;
      }
      if (!IMAGE_EXT.test(item.name)) continue;
      const size = Number(item.metadata?.size ?? item.metadata?.contentLength ?? 0);
      const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
      found.push({
        path,
        name: item.name,
        size: Number.isFinite(size) ? size : 0,
        createdAt: item.created_at,
        url: pub.publicUrl,
      });
    }

    if (items.length < limit) break;
    offset += items.length;
  }

  return found;
}

function safeImagePath(value: unknown) {
  const path = String(value || "");
  if (!path || path.includes("..") || path.startsWith("/") || path.includes("\\")) {
    return null;
  }
  if (!/^[\w./-]+$/.test(path) || !IMAGE_EXT.test(path)) return null;
  return path;
}

async function backendSizes() {
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!connectionString) throw new Error("Database connection is not configured");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    const { rows } = await client.query<{
      database_bytes: string;
      image_bytes: string;
      other_file_bytes: string;
      text_bytes: string;
    }>(`
      SELECT pg_database_size(current_database())::bigint AS database_bytes,
             COALESCE((
               SELECT SUM((metadata->>'size')::bigint)
               FROM storage.objects
               WHERE COALESCE(metadata->>'mimetype', '') LIKE 'image/%'
                  OR lower(name) ~ '\\.(webp|png|jpe?g|gif|avif)$'
             ), 0)::bigint AS image_bytes,
             COALESCE((
               SELECT SUM((metadata->>'size')::bigint)
               FROM storage.objects
               WHERE NOT (
                 COALESCE(metadata->>'mimetype', '') LIKE 'image/%'
                 OR lower(name) ~ '\\.(webp|png|jpe?g|gif|avif)$'
               )
             ), 0)::bigint AS other_file_bytes,
             COALESCE((
               SELECT SUM(pg_total_relation_size(t))
               FROM (
                 SELECT to_regclass('public.inquiries') AS t
                 UNION ALL SELECT to_regclass('public.feedback')
                 UNION ALL SELECT to_regclass('public.catalog_products')
                 UNION ALL SELECT to_regclass('public.catalog_categories')
                 UNION ALL SELECT to_regclass('public.profile')
               ) tables
               WHERE t IS NOT NULL
             ), 0)::bigint AS text_bytes
    `);
    const databaseBytes = Number(rows[0]?.database_bytes || 0);
    const imageBytes = Number(rows[0]?.image_bytes || 0);
    const otherFileBytes = Number(rows[0]?.other_file_bytes || 0);
    return {
      databaseBytes,
      storageBytes: imageBytes + otherFileBytes,
      imageBytes,
      otherBytes: databaseBytes + otherFileBytes,
      textBytes: Number(rows[0]?.text_bytes || 0),
    };
  } finally {
    await client.end();
  }
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const sb = getSupabaseAdmin();
    const [files, products, sizes] = await Promise.all([
      listImages(sb),
      getAllProductsAdmin(),
      backendSizes(),
    ]);
    files.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return NextResponse.json({
      files,
      products: products.map((product) => ({
        id: product.id,
        name: product.displayName || product.name,
        category: product.category,
        images: product.images,
      })),
      databaseBytes: sizes.databaseBytes,
      storageBytes: sizes.storageBytes,
      imageBytes: sizes.imageBytes,
      otherBytes: sizes.otherBytes,
      textBytes: sizes.textBytes,
      limitBytes: 500 * 1024 * 1024,
    });
  } catch (e) {
    console.error("media list failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not list images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const requested = Array.isArray(body?.paths) ? body.paths : [body?.path];
    const paths = [
      ...new Set(
        requested
          .map((value: unknown) => safeImagePath(value))
          .filter((value: string | null): value is string => Boolean(value))
      ),
    ];
    if (!paths.length) {
      return NextResponse.json({ error: "Invalid image path" }, { status: 400 });
    }
    if (paths.length > 100) {
      return NextResponse.json({ error: "Select up to 100 images at a time" }, { status: 400 });
    }

    const sb = getSupabaseAdmin();
    const { error } = await sb.storage.from(BUCKET).remove(paths);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const markers = paths.map((path) => `/${BUCKET}/${path}`);
    const { data: products, error: readError } = await sb
      .from("catalog_products")
      .select("id, images");
    if (readError) {
      return NextResponse.json({ error: readError.message }, { status: 500 });
    }

    for (const product of products || []) {
      const images = Array.isArray(product.images)
        ? product.images.filter(
            (url) => typeof url === "string" && !markers.some((marker) => url.includes(marker))
          )
        : [];
      const previous = Array.isArray(product.images) ? product.images.length : 0;
      if (images.length === previous) continue;
      const { error: updateError } = await sb
        .from("catalog_products")
        .update({ images })
        .eq("id", product.id);
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("media delete failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not delete image" },
      { status: 500 }
    );
  }
}

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
        { error: "Image too large (max 20MB)" },
        { status: 400 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    const meta = await sharp(input, { failOn: "none" }).metadata();
    const withinLimit = (meta.width ?? 0) <= 2000 && (meta.height ?? 0) <= 2000;
    const webp =
      file.type === "image/webp" && withinLimit
        ? input
        : await sharp(input, { failOn: "none" })
            .rotate()
            .resize({
              width: 2000,
              height: 2000,
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({ quality: 90, effort: 4 })
            .toBuffer();
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
    console.error("media upload failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
