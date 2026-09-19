const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function main() {
  const sql = fs.readFileSync(
    path.join("supabase", "migrations", "20260919_product_color_secondary.sql"),
    "utf8"
  );
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error("NO_DB_URL");
    process.exit(1);
  }
  const c = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await c.connect();
  await c.query(sql);
  console.log("OK color_hex_secondary");
  await c.end();
}

main().catch((e) => {
  console.error("FAIL", e.message);
  process.exit(1);
});
