import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Ctx = { params: Promise<{ id: string }> };

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  const catId = Number(id);
  if (!catId) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (body.name != null) patch.name = String(body.name).trim();
    if (body.slug != null) patch.slug = String(body.slug).trim();
    else if (body.name != null) patch.slug = slugify(String(body.name));
    if (body.description != null)
      patch.description = String(body.description).trim();
    if (body.sortOrder != null) patch.sort_order = Number(body.sortOrder) || 0;

    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("catalog_categories")
      .update(patch)
      .eq("id", catId)
      .select("*")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    revalidatePath("/products");
    return NextResponse.json({ category: data });
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
  const { id } = await ctx.params;
  const catId = Number(id);
  if (!catId) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const sb = getSupabaseAdmin();
    const { count, error: countErr } = await sb
      .from("catalog_products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", catId);
    if (countErr) {
      return NextResponse.json({ error: countErr.message }, { status: 500 });
    }
    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: "Category has products; reassign or delete them first." },
        { status: 409 }
      );
    }
    const { error } = await sb
      .from("catalog_categories")
      .delete()
      .eq("id", catId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    revalidatePath("/products");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
