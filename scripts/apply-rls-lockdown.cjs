/* Apply supabase/migrations/20261127_lock_down_admin_data.sql */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function main() {
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error("Missing DATABASE_URL or SUPABASE_DB_URL");
    process.exit(1);
  }
  const sqlPath = path.join(
    __dirname,
    "..",
    "supabase",
    "migrations",
    "20261127_lock_down_admin_data.sql"
  );
  const sql = fs.readFileSync(sqlPath, "utf8");
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(sql);
  const { rows } = await client.query(
    `select schemaname, tablename, policyname
     from pg_policies
     where tablename in ('inquiries', 'profile', 'feedback')
     order by tablename, policyname`
  );
  console.log("Policies now:");
  for (const row of rows) {
    console.log(`- ${row.tablename}: ${row.policyname}`);
  }
  await client.end();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
