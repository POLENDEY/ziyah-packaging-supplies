import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "pg";

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

const sql = `
-- Privileges required for Supabase anon/authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON TABLE public.profile TO anon, authenticated;
GRANT ALL ON TABLE public.profile TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.inquiries TO anon, authenticated;
GRANT ALL ON TABLE public.inquiries TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.products TO anon, authenticated;
GRANT ALL ON TABLE public.products TO service_role;

GRANT INSERT ON TABLE public.chatbot_logs TO anon, authenticated;
GRANT ALL ON TABLE public.chatbot_logs TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon select profile" ON public.profile;
CREATE POLICY "Allow anon select profile"
  ON public.profile FOR SELECT
  TO anon, authenticated
  USING (true);
`;

const client = new Client({
  connectionString: env.DATABASE_URL || env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
await client.query(sql);

const users = await client.query(
  `select id, username from public.profile order by id`
);
console.log("profiles:", users.rows.map((r) => r.username).join(", ") || "(none)");
await client.end();
console.log("OK grants and RLS policies applied");
