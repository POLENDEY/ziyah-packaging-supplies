# Supabase Product CMS + SSR Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the product catalog to Supabase with admin CRUD (images→WebP, video, tiers, categories) and SSR/ISR public pages for SEO.

**Architecture:** Next.js API routes use a service-role Supabase client for writes and Storage; public pages server-fetch published products with ISR. Admin UI extends `/ziyah-admin`. A mapper keeps the existing `Product` shape so gallery/purchase/search need minimal churn.

**Tech Stack:** Next.js App Router, Supabase Postgres + Storage, `sharp` (WebP), existing ziyah-admin AuthGuard, `revalidatePath`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-19-supabase-product-cms-design.md`
- Full migrate; static `products.ts` becomes seed input only after cutover
- Price tiers JSON + display price
- New image uploads auto-convert to WebP (~quality 80) via sharp
- Video as-is or URL; no transcode
- Preserve numeric product `id`s on seed so `/products/{id}` URLs stay valid
- Public SSR/ISR (`revalidate` ≈ 60) + revalidate on admin save
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser
- Do not run `npm run build` unless the user asks
- Do not commit unless the user asks
- Do not print or commit secrets from `.env.local`

## File map

| File | Responsibility |
| --- | --- |
| `supabase/migrations/20260919_product_cms.sql` | categories, products, storage bucket policies |
| `src/lib/supabaseAdmin.ts` | Service-role server client |
| `src/lib/catalog/types.ts` | DB row types + PriceTier |
| `src/lib/catalog/mapProduct.ts` | DB row → existing `Product` shape |
| `src/lib/catalog/queries.ts` | Server reads: list/get/categories |
| `scripts/seed-products.mjs` | Seed from static catalog |
| `src/app/api/admin/session/route.ts` | Set/clear httpOnly admin cookie on login/logout |
| `src/lib/adminAuth.ts` | Verify admin cookie on write APIs |
| `src/app/api/admin/categories/route.ts` | Category CRUD |
| `src/app/api/admin/products/route.ts` | Product CRUD |
| `src/app/api/admin/products/[id]/route.ts` | Get/patch/delete one product |
| `src/app/api/admin/media/route.ts` | Image→WebP + video upload |
| `src/app/api/catalog/products/route.ts` | Public JSON for ProductSearch (published only) |
| `src/app/ziyah-admin/ProductManager.tsx` | Products CMS UI |
| `src/app/ziyah-admin/CategoryManager.tsx` | Categories CMS UI |
| `src/app/ziyah-admin/page.tsx` | Add tabs |
| `src/app/ziyah-admin/login/LoginForm.tsx` | Call session API after successful login |
| `src/app/products/page.tsx` + `[id]/page.tsx` | SSR from DB |
| `src/app/products/ProductsClient.tsx` | Accept products props from server |
| `src/app/components/ProductSearch.tsx` | Fetch `/api/catalog/products` |
| `next.config.ts` | Supabase Storage `remotePatterns` |
| `package.json` | Add `sharp` |

---

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

### Task 2: Seed script (preserve IDs)

**Files:**
- Create: `scripts/seed-products.mjs`
- Modify: `package.json` script `"db:seed-products": "node scripts/seed-products.mjs"`

**Interfaces:**
- Consumes: static products from compiled/import path — prefer reading `src/data/products.ts` via dynamic import with `tsx` OR duplicate seed data export. Recommended: add `scripts/seed-products.mjs` that uses `pg`/`@supabase/supabase-js` with service role and imports product JSON exported by a small `scripts/export-catalog.mjs` — simplest path: use `npx tsx scripts/seed-products.ts` importing `@/data/products` and `@/data/categories`.

**Recommended implement:** `scripts/seed-products.ts` run with `npx tsx`.

- [ ] **Step 1: Implement seed**

Logic:

1. Upsert categories from unique `product.category` + `CATEGORY_LANDINGS` (slug, description from landing)
2. Upsert each product with **same `id`**, map fields, `images` as current public paths, `video_url` from `video`, `is_published: true`
3. Resolve `category_id` by name

- [ ] **Step 2: Run seed against project Supabase**

```bash
npx tsx scripts/seed-products.ts
```

Expected: row counts match static catalog; spot-check id `1` exists.

- [ ] **Step 3: Verify**

In Supabase Table Editor: categories ≥ 5, products count = static length.

---

### Task 3: Server catalog queries + public read API

**Files:**
- Create: `src/lib/catalog/queries.ts`
- Create: `src/app/api/catalog/products/route.ts`

**Interfaces:**
- Produces:
  - `getPublishedProducts(): Promise<Product[]>`
  - `getPublishedProductById(id: number): Promise<Product | null>`
  - `getCategories(): Promise<DbCategory[]>`
  - `GET /api/catalog/products` → `{ products: Product[] }`

```ts
// queries.ts sketch
export async function getPublishedProducts() {
  const sb = getSupabaseAdmin(); // or anon client for reads — admin OK server-only
  const { data, error } = await sb
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_published", true)
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapDbProductToProduct);
}
```

Use anon `supabase` for public reads if RLS allows SELECT on published rows; otherwise service role **only in server components/route handlers**. Prefer RLS: `is_published = true` SELECT for `anon`. Add policy in migration:

```sql
alter table public.products enable row level security;
create policy "Public read published products"
  on public.products for select
  to anon, authenticated
  using (is_published = true);

alter table public.categories enable row level security;
create policy "Public read categories"
  on public.categories for select
  to anon, authenticated
  using (true);
```

Writes: no anon policies (service role bypasses RLS).

- [ ] **Step 1: Implement queries + GET catalog API**
- [ ] **Step 2: Curl/dev check**

```bash
# with dev server
curl -s http://localhost:3000/api/catalog/products | head
```

Expected: JSON array of products with `name`, `desc`, `images`.

---

### Task 4: Admin session cookie + auth helper

**Files:**
- Create: `src/lib/adminAuth.ts`
- Create: `src/app/api/admin/session/route.ts`
- Modify: `src/app/ziyah-admin/login/LoginForm.tsx`
- Modify: logout in `src/app/ziyah-admin/page.tsx`

**Interfaces:**
- Produces: `assertAdmin(request: Request)` throws/returns 401 Response
- Cookie name: `ziyah_admin_session=1` (httpOnly, sameSite=lax, path=/, secure in prod)

- [ ] **Step 1: Session POST/DELETE route**

POST after successful profile login: set cookie. DELETE on logout: clear cookie. Optionally verify username/password server-side in POST body instead of trusting client-only login — **recommended:** move credential check into `POST /api/admin/session` using service role against `profile` table; LoginForm only calls this API.

- [ ] **Step 2: `assertAdmin`**

```ts
import { cookies } from "next/headers";

export async function assertAdmin() {
  const jar = await cookies();
  if (jar.get("ziyah_admin_session")?.value !== "1") {
    return false;
  }
  return true;
}
```

- [ ] **Step 3: Verify**

Login sets cookie; logout clears; unauthenticated write returns 401.

---

### Task 5: Media upload API (WebP)

**Files:**
- Create: `src/app/api/admin/media/route.ts`
- Modify: `package.json` — dependency `sharp`

**Interfaces:**
- `POST` multipart: `file`, optional `productId`, `kind` = `image` | `video`
- Returns `{ url: string }`
- Images: sharp → webp quality 80 → Storage `product-media/products/{productId|temp}/{uuid}.webp`

```ts
import sharp from "sharp";
// ...
const buf = Buffer.from(await file.arrayBuffer());
const webp = await sharp(buf).rotate().webp({ quality: 80 }).toBuffer();
```

Max image 10MB; video 50MB. `assertAdmin` required.

- [ ] **Step 1: `npm install sharp`**
- [ ] **Step 2: Implement route**
- [ ] **Step 3: Verify** with a sample upload (admin cookie) — URL ends in `.webp`

---

### Task 6: Categories + Products admin APIs

**Files:**
- Create: `src/app/api/admin/categories/route.ts`
- Create: `src/app/api/admin/categories/[id]/route.ts`
- Create: `src/app/api/admin/products/route.ts`
- Create: `src/app/api/admin/products/[id]/route.ts`

**Interfaces:**
- Categories: GET all (admin), POST, PATCH, DELETE (409 if products reference)
- Products: GET all (incl. unpublished), POST, PATCH, DELETE
- On successful product/category mutation: `revalidatePath("/products")`, `revalidatePath("/products/[id]")` as needed, and category landing paths

Request bodies use camelCase; map to DB columns server-side.

- [ ] **Step 1: Implement category routes**
- [ ] **Step 2: Implement product routes**
- [ ] **Step 3: Verify 401 without cookie; 200 with cookie**

---

### Task 7: Admin UI — CategoryManager + ProductManager

**Files:**
- Create: `src/app/ziyah-admin/CategoryManager.tsx` (+ CSS module or reuse `admin.module.css`)
- Create: `src/app/ziyah-admin/ProductManager.tsx`
- Modify: `src/app/ziyah-admin/page.tsx` — tabs `products` | `categories`

**Interfaces:**
- ProductManager calls admin APIs + media upload; supports tiers editor, multi-image, video URL/file, publish toggle, category select + inline “Add category”
- Match existing admin visual patterns (no unrelated redesign)

- [ ] **Step 1: CategoryManager CRUD UI**
- [ ] **Step 2: ProductManager list + form**
- [ ] **Step 3: Wire tabs in `page.tsx`**
- [ ] **Step 4: Manual QA in `/ziyah-admin`**

---

### Task 8: Public storefront SSR/ISR cutover

**Files:**
- Modify: `src/app/products/page.tsx` — remove `force-static`; fetch `getPublishedProducts()`; `export const revalidate = 60`
- Modify: `src/app/products/[id]/page.tsx` — DB fetch; `generateStaticParams` optional empty + `dynamicParams = true` OR generate from DB; `revalidate = 60`
- Modify: `src/app/products/ProductsClient.tsx` — accept `products` prop from server
- Modify: category landing pages / `CategoryLandingView` to use DB products by category
- Modify: `src/app/components/ProductSearch.tsx` — load from `/api/catalog/products`
- Modify: `next.config.ts` — add Storage host:

```ts
{
  protocol: "https",
  hostname: "peauxhtyejfsmorvpqva.supabase.co", // or *.supabase.co
  pathname: "/storage/v1/object/public/**",
},
```

Prefer hostname pattern from `NEXT_PUBLIC_SUPABASE_URL` documented in plan comments; use project ref host.

- Modify: home `page.tsx` category links if they hardcode static lists — keep hrefs; counts from DB if shown
- Stop runtime imports of static `products` array from `src/data/products.ts` (keep types/helpers that don't need the array, or move helpers to `src/lib/catalog/`)

- [ ] **Step 1: Cut over list + detail SSR**
- [ ] **Step 2: Search + category landings**
- [ ] **Step 3: remotePatterns**
- [ ] **Step 4: SEO check** — View Source on `/products/{id}` contains description text and image URLs

---

### Task 9: Final verification checklist

- [ ] Seeded IDs match old URLs
- [ ] Admin create product + WebP image in Storage
- [ ] Edit / delete / unpublish works; unpublished 404
- [ ] New category appears in filters
- [ ] SSR metadata + JSON-LD present
- [ ] Unauthenticated admin write → 401
- [ ] No service role in client bundles (`rg SERVICE_ROLE src/app/components` empty)

---

## Spec coverage self-review

| Spec item | Task |
| --- | --- |
| categories + products tables | 1 |
| Storage bucket | 1 |
| Seed preserve ids | 2 |
| Server queries / public API | 3 |
| Admin session hardening | 4 |
| WebP upload | 5 |
| Admin CRUD APIs | 6 |
| Admin UI Products/Categories | 7 |
| SSR/ISR + SEO + search | 8 |
| Checklist | 9 |

## Placeholder scan

No TBD left; sharp quality **80**; revalidate **60**; cookie **`ziyah_admin_session`**; bucket **`product-media`**.
