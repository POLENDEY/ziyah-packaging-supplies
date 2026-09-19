alter table public.catalog_products
  add column if not exists color_hex_secondary text;

update public.catalog_products
set
  color_hex = coalesce(nullif(trim(color_hex), ''), '#e53935'),
  color_hex_secondary = coalesce(nullif(trim(color_hex_secondary), ''), '#1c141f')
where lower(trim(color)) = 'red & black';
