import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getAllCategoriesAdmin } from "@/lib/catalog/queries";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const categories = await getAllCategoriesAdmin();
    return NextResponse.json({ categories });
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
    const body = await request.json();
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    const slug = String(body.slug || slugify(name)).trim();
    const description = String(body.description || "").trim();
    const sort_order = Number(body.sortOrder ?? 0) || 0;
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("catalog_categories")
      .insert({ name, slug, description, sort_order })
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
