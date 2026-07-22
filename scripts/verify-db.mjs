import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const client = new Client({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
const tables = await client.query(
  `select table_name from information_schema.tables
   where table_schema = 'public'
     and table_name in ('inquiries','profile','products','chatbot_logs')
   order by 1`
);
console.log("tables:", tables.rows.map((r) => r.table_name).join(", "));
const admin = await client.query(
  `select count(*)::int as n from profile where username = 'admin'`
);
console.log("admin_exists:", admin.rows[0].n > 0);
await client.end();

const keys = [
  ["anon", env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  ["publishable", env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY],
];

for (const [label, key] of keys) {
  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false },
  });
  const { error } = await sb.from("inquiries").select("id").limit(1);
  console.log(label + "_key:", error ? error.message : "OK");
}
