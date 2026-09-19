/**
 * Backfill best_for + faqs on existing catalog products from generated defaults.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { getProductFaqs } from "../src/data/products";
import { mapDbProductToProduct } from "../src/lib/catalog/mapProduct";
import type { DbProductRow } from "../src/lib/catalog/types";

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
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const DEFAULT_BEST_FOR =
  "Takeout, meal prep, catering, and food delivery brands across the Philippines";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await sb
    .from("catalog_products")
    .select("*, catalog_categories ( name, slug )");
  if (error) throw error;

  let updated = 0;
  for (const row of data ?? []) {
    const mapped = mapDbProductToProduct({
      ...(row as DbProductRow),
      categories:
        (row as { catalog_categories?: DbProductRow["categories"] })
          .catalog_categories ?? null,
    });
    const faqs = getProductFaqs({ ...mapped, faqs: undefined });
    const { error: upErr } = await sb
      .from("catalog_products")
      .update({
        best_for: mapped.bestFor || DEFAULT_BEST_FOR,
        about_extra: mapped.aboutExtra || "",
        faqs,
        updated_at: new Date().toISOString(),
      })
      .eq("id", mapped.id);
    if (upErr) throw upErr;
    updated += 1;
  }

  console.log(`Backfilled SEO fields on ${updated} products`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
