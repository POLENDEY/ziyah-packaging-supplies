import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getAllProductsAdmin } from "@/lib/catalog/queries";
import { toDbProductPayload } from "@/lib/catalog/mapProduct";
import type { ProductWriteInput } from "@/lib/catalog/types";
import { mapDbProductToProduct } from "@/lib/catalog/mapProduct";
import type { DbProductRow } from "@/lib/catalog/types";

function parseBody(body: Record<string, unknown>): ProductWriteInput {
  return {
    id: body.id != null ? Number(body.id) : undefined,
    name: String(body.name || ""),
    displayName: body.displayName != null ? String(body.displayName) : null,
    description: String(body.description || ""),
    longDescription: String(body.longDescription || ""),
    categoryId: Number(body.categoryId),
    type: body.type === "Reusable" ? "Reusable" : "Disposable",
    color: body.color != null ? String(body.color) : null,
    colorHex: body.colorHex != null ? String(body.colorHex) : null,
    dimensions: String(body.dimensions || ""),
    unit: body.unit != null ? String(body.unit) : "/ piece",
    badge:
      body.badge === "badgeReusable" || body.badge === "badgeNew"
        ? body.badge
        : "badgeDisposable",
    price: String(body.price || ""),
    priceTiers: Array.isArray(body.priceTiers)
      ? (body.priceTiers as ProductWriteInput["priceTiers"])
      : [],
    images: Array.isArray(body.images)
      ? body.images.map(String)
      : [],
    videoUrl: body.videoUrl != null ? String(body.videoUrl) : null,
    variantGroup:
      body.variantGroup != null ? String(body.variantGroup) : null,
    specs: Array.isArray(body.specs)
      ? (body.specs as ProductWriteInput["specs"])
      : [],
    bestFor: body.bestFor != null ? String(body.bestFor) : null,
    aboutExtra: body.aboutExtra != null ? String(body.aboutExtra) : null,
    faqs: Array.isArray(body.faqs)
      ? (body.faqs as ProductWriteInput["faqs"])
      : [],
    isPublished: body.isPublished !== false,
  };
}

async function nextProductId(sb: ReturnType<typeof getSupabaseAdmin>) {
  const { data } = await sb
    .from("catalog_products")
    .select("id")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();
  return Number(data?.id || 0) + 1;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const products = await getAllProductsAdmin();
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = parseBody(await request.json());
    if (!body.name.trim() || !body.categoryId) {
      return NextResponse.json(
        { error: "name and categoryId required" },
        { status: 400 }
      );
    }
    const sb = getSupabaseAdmin();
    const id = body.id && body.id > 0 ? body.id : await nextProductId(sb);
    const payload = toDbProductPayload({ ...body, id });
    const { data, error } = await sb
      .from("catalog_products")
      .insert(payload)
      .select("*, catalog_categories ( name, slug )")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const row = data as Record<string, unknown>;
    const mapped = mapDbProductToProduct({
      ...(row as unknown as DbProductRow),
      categories: (row.catalog_categories as DbProductRow["categories"]) ?? null,
    });
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return NextResponse.json({ product: mapped });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
