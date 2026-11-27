### Task 1: Schema, admin client, catalog types/mapper

**Files:**
- Create: `supabase/migrations/20260919_product_cms.sql`
- Create: `src/lib/supabaseAdmin.ts`
- Create: `src/lib/catalog/types.ts`
- Create: `src/lib/catalog/mapProduct.ts`
- Modify: `package.json` (add `sharp` when needed in Task 4 — or add here)

**Interfaces:**
- Produces: `getSupabaseAdmin()`, `DbCategory`, `DbProduct`, `mapDbProductToProduct(row): Product`
- Consumes: env `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`

- [ ] **Step 1: Write SQL migration**

Create `supabase/migrations/20260919_product_cms.sql`:

```sql
create table if not exists public.categories (
  id bigserial primary key,
  name text not null unique,
  slug text not null unique,
  description text default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint primary key,
  name text not null,
  display_name text,
  description text not null default '',
  long_description text not null default '',
  category_id bigint not null references public.categories(id),
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

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_published_idx on public.products(is_published);

-- Storage bucket (run in SQL editor / dashboard if storage API differs)
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;
```

Also add storage policies: public SELECT on `product-media`; INSERT/UPDATE/DELETE only for service role (or via dashboard). Document manual apply in Supabase SQL editor if CLI not configured.

- [ ] **Step 2: Create service-role client**

`src/lib/supabaseAdmin.ts`:

```ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!admin) {
    admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}
```

- [ ] **Step 3: Types + mapper**

`mapDbProductToProduct` must output the existing `Product` type fields:

- `desc` ← `description`
- `longDesc` ← `long_description`
- `category` ← joined `categories.name`
- `video` ← `video_url`
- `priceTiers` ← `price_tiers`
- `images`, `type`, `badge`, `specs`, `variantGroup`, `color`, `colorHex`, `displayName` mapped similarly

Include `specs` and `variant_group` / `color_hex` columns so seed does not lose PDP data.

- [ ] **Step 4: Verify**

Confirm files exist; SQL is ready to paste into Supabase. User/agent applies migration before seed.

- [ ] **Step 5: Commit only if user asked**

---

