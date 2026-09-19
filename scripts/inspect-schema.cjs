const { Client } = require("pg");

async function main() {
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  const c = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await c.connect();
  const tables = await c.query(`
    select table_name from information_schema.tables
    where table_schema = 'public'
    order by table_name
  `);
  console.log("TABLES", tables.rows.map((r) => r.table_name).join(", "));
  for (const name of [
    "products",
    "categories",
    "catalog_products",
    "catalog_categories",
  ]) {
    const cols = await c.query(
      `select column_name, data_type from information_schema.columns
       where table_schema='public' and table_name=$1 order by ordinal_position`,
      [name]
    );
    if (cols.rows.length) {
      console.log("COLS", name, cols.rows.map((r) => r.column_name + ":" + r.data_type).join(" | "));
    }
  }
  await c.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
