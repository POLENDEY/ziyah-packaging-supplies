const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const raw = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

(async () => {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data, error } = await sb
    .from("catalog_products")
    .select("id, name, is_published, catalog_categories(name)")
    .eq("is_published", true)
    .limit(3);
  if (error) {
    console.error("FAIL", error.message);
    process.exit(1);
  }
  console.log(
    "OK sample",
    data.map((r) => `${r.id}:${r.name}:${r.catalog_categories?.name}`).join(" | ")
  );
})();
