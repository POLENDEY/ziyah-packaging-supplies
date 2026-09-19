-- Website catalog CMS (avoids conflicting with existing public.products)
-- Apply in Supabase SQL Editor if CLI is unavailable.

create table if not exists public.catalog_categories (
  id bigserial primary key,
  name text not null unique,
  slug text not null unique,
  description text default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_products (
  id bigint primary key,
  name text not null,
  display_name text,
  description text not null default '',
  long_description text not null default '',
  category_id bigint not null references public.catalog_categories(id),
  type text not null check (type in ('Disposable', 'Reusable')),
  color text,
  color_hex text,
  dimensions text not null default '',
  unit text not null default 'piece',
  badge text not null default 'badgeDisposable',
  price text not null default '',
  price_tiers jsonb not null default '[]'::jsonb,
  images text[] not null default '{}',
  video_url text,
  variant_group text,
  specs jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_products_category_id_idx
  on public.catalog_products(category_id);
create index if not exists catalog_products_published_idx
  on public.catalog_products(is_published);

alter table public.catalog_products enable row level security;
alter table public.catalog_categories enable row level security;

drop policy if exists "Public read published catalog products" on public.catalog_products;
create policy "Public read published catalog products"
  on public.catalog_products for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Public read catalog categories" on public.catalog_categories;
create policy "Public read catalog categories"
  on public.catalog_categories for select
  to anon, authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read product media" on storage.objects;
create policy "Public read product media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-media');
