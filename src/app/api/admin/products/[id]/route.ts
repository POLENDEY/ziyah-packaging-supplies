import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { toDbProductPayload, mapDbProductToProduct } from "@/lib/catalog/mapProduct";
import type { DbProductRow, ProductWriteInput } from "@/lib/catalog/types";

type Ctx = { params: Promise<{ id: string }> };

function parseBody(body: Record<string, unknown>): ProductWriteInput {
  return {
    name: String(body.name || ""),
    displayName: body.displayName != null ? String(body.displayName) : null,
    description: String(body.description || ""),
    longDescription: String(body.longDescription || ""),
    categoryId: Number(body.categoryId),
    type: body.type === "Reusable" ? "Reusable" : "Disposable",
    color: body.color != null ? String(body.color) : null,
    colorHex: body.colorHex != null ? String(body.colorHex) : null,
    colorHexSecondary:
      body.colorHexSecondary != null ? String(body.colorHexSecondary) : null,
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
    images: Array.isArray(body.images) ? body.images.map(String) : [],
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

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: idParam } = await ctx.params;
  const id = Number(idParam);
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = parseBody(await request.json());
    const sb = getSupabaseAdmin();
    const payload = toDbProductPayload(body);
    delete (payload as { id?: number }).id;
    const { data, error } = await sb
      .from("catalog_products")
      .update(payload)
      .eq("id", id)
      .select("*, catalog_categories ( name, slug )")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const row = data as Record<string, unknown>;
    const product = mapDbProductToProduct({
      ...(row as unknown as DbProductRow),
      categories: (row.catalog_categories as DbProductRow["categories"]) ?? null,
    });
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: idParam } = await ctx.params;
  const id = Number(idParam);
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from("catalog_products").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
