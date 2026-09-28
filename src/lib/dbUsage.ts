type UsageRow = {
  database_bytes: string;
  image_bytes: string;
  other_file_bytes: string;
  text_bytes: string;
};

export async function readDatabaseUsage() {
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!connectionString) throw new Error("Database connection is not configured");

  const { Client } = await import("pg");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    const { rows } = await client.query<UsageRow>(`
      SELECT pg_database_size(current_database())::bigint AS database_bytes,
             COALESCE((
               SELECT SUM((metadata->>'size')::bigint)
               FROM storage.objects
               WHERE COALESCE(metadata->>'mimetype', '') LIKE 'image/%'
                  OR lower(name) ~ '\\.(webp|png|jpe?g|gif|avif)$'
             ), 0)::bigint AS image_bytes,
             COALESCE((
               SELECT SUM((metadata->>'size')::bigint)
               FROM storage.objects
               WHERE NOT (
                 COALESCE(metadata->>'mimetype', '') LIKE 'image/%'
                 OR lower(name) ~ '\\.(webp|png|jpe?g|gif|avif)$'
               )
             ), 0)::bigint AS other_file_bytes,
             COALESCE((
               SELECT SUM(pg_total_relation_size(t))
               FROM (
                 SELECT to_regclass('public.inquiries') AS t
                 UNION ALL SELECT to_regclass('public.feedback')
                 UNION ALL SELECT to_regclass('public.catalog_products')
                 UNION ALL SELECT to_regclass('public.catalog_categories')
                 UNION ALL SELECT to_regclass('public.profile')
               ) tables
               WHERE t IS NOT NULL
             ), 0)::bigint AS text_bytes
    `);
    const databaseBytes = Number(rows[0]?.database_bytes || 0);
    const imageBytes = Number(rows[0]?.image_bytes || 0);
    const otherFileBytes = Number(rows[0]?.other_file_bytes || 0);
    return {
      databaseBytes,
      storageBytes: imageBytes + otherFileBytes,
      imageBytes,
      otherBytes: databaseBytes + otherFileBytes,
      textBytes: Number(rows[0]?.text_bytes || 0),
    };
  } finally {
    await client.end();
  }
}
