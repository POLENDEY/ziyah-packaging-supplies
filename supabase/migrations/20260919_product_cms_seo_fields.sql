-- SEO / PDP content fields for CMS
alter table public.catalog_products
  add column if not exists best_for text default '',
  add column if not exists about_extra text default '',
  add column if not exists faqs jsonb not null default '[]'::jsonb;
