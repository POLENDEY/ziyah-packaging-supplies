import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { products } from "../src/data/products";
import { CATEGORY_LANDINGS } from "../src/data/categories";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase env");
  }
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const categoryNames = [...new Set(products.map((p) => p.category))];
  const categoryIdByName = new Map<string, number>();

  for (const [index, name] of categoryNames.entries()) {
    const landing = CATEGORY_LANDINGS.find((c) => c.category === name);
    const slug = landing?.slug ?? slugify(name);
    const description = landing?.description ?? landing?.intro ?? "";
    const { error } = await sb.from("catalog_categories").upsert(
      {
        name,
        slug,
        description,
        sort_order: index,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "name" }
    );
    if (error) throw error;
  }

  const { data: cats, error: catErr } = await sb
    .from("catalog_categories")
    .select("id, name");
  if (catErr) throw catErr;
  for (const c of cats ?? []) categoryIdByName.set(c.name, c.id);

  for (const p of products) {
    const category_id = categoryIdByName.get(p.category);
    if (!category_id) {
      throw new Error(`Missing category id for ${p.category}`);
    }
    const { error } = await sb.from("catalog_products").upsert(
      {
        id: p.id,
        name: p.name,
        display_name: p.displayName ?? p.name,
        description: p.desc,
        long_description: p.longDesc,
        category_id,
        type: p.type,
        color: p.color ?? null,
        color_hex: p.colorHex ?? null,
        dimensions: p.dimensions,
        unit: p.unit,
        badge: p.badge,
        price: p.price,
        price_tiers: p.priceTiers,
        images: p.images,
        video_url: p.video ?? null,
        variant_group: p.variantGroup ?? null,
        specs: p.specs,
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) throw error;
  }

  console.log(
    `Seeded ${categoryNames.length} categories, ${products.length} products`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
