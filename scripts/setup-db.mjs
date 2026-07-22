/**
 * Applies supabase_setup.sql using the Database connection string.
 *
 * Usage:
 *   1. Add DATABASE_URL to .env.local from Supabase:
 *      Project Settings → Database → Connection string (URI)
 *   2. npm run db:setup
 *
 * Or paste supabase_setup.sql into the Supabase SQL Editor and click Run.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
      })
  );
}

async function main() {
  const env = loadEnv();
  const databaseUrl =
    env.DATABASE_URL ||
    env.SUPABASE_DB_URL ||
    env.POSTGRES_URL ||
    process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error(`
Missing DATABASE_URL.

API keys in .env.local can read/write rows, but cannot CREATE tables.
Add your Postgres connection string to .env.local, then re-run:

  DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[DB_PASSWORD]@aws-0-....pooler.supabase.com:6543/postgres

Find it in: Supabase Dashboard → Project Settings → Database → Connection string (URI)

Alternatively, open supabase_setup.sql in the Supabase SQL Editor and click Run.
`);
    process.exit(1);
  }

  const sql = fs.readFileSync(path.join(root, "supabase_setup.sql"), "utf8");
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query(sql);
    console.log("OK Ziyah tables ready: inquiries, profile, products, chatbot_logs");
    console.log("Default CMS login (if newly created): admin / admin123");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
