# Supabase Product CMS + SSR Catalog Design

**Date:** 2026-09-19  
**Status:** Approved for planning  
**Approach:** Full migrate to Supabase + Admin API/Storage + ISR storefront  
**Extras:** Auto WebP conversion for uploaded product images; price tiers; category CRUD

## Goal

Replace the static `src/data/products.ts` catalog with a Supabase-backed product CMS so admins can create, edit, delete, and publish products (images, video, title, description, price tiers, sizes) and categories — while public product pages render descriptions and images via SSR/ISR for SEO.

## Decisions locked

| Topic | Choice |
| --- | --- |
| Catalog source | **Full migrate** to Supabase (static TS becomes seed input only) |
| Pricing | **Price tiers** (box/pack/piece rows) + display price |
| Architecture | Admin → Next API (service role) → Supabase DB + Storage; public SSR/ISR |
| Image uploads | **Auto-convert to WebP** on upload (quality ~80); store `.webp` only |
| Video | Store as-is (MP4/WebM) or URL; no transcode in v1 |
| Categories | First-class `categories` table; admin CRUD; products FK |
| Type filter | Keep Disposable / Reusable on products |
| Admin shell | Extend `/ziyah-admin` (Products + Categories tabs) |
| Auth | Keep existing AuthGuard / localStorage session for UI; writes only via API; harden write routes with admin session check |
| Storage | Public bucket `product-media` for SEO-friendly image URLs |
| Public rendering | Server fetch + ISR (`revalidate` ~60) + `revalidatePath`/tag on admin save |
| Out of scope v1 | Customer uploads, multi-role Auth rewrite, video transcode, hybrid static+DB |

## Architecture overview

```
ziyah-admin (Products / Categories)
  → /api/admin/products|categories|media
      → sharp (images → WebP)
      → Supabase Storage (product-media)
      → Supabase Postgres (categories, products)
      → revalidatePath('/products'), revalidatePath('/products/[id]')

Public
  /products, /products/[id], category landings
      → server load from Supabase
      → generateMetadata + JSON-LD (title, description, WebP images)
      → next/image (remotePatterns for Storage host)
```

---

## 1. Data model

### `categories`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid / bigserial | PK |
| name | text | unique display name (e.g. Hard Bento Clear) |
| slug | text | unique URL segment |
| description | text | optional SEO/listing blurb |
| sort_order | int | default 0 |
| created_at / updated_at | timestamptz | |

### `products`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigserial | Stable numeric id for `/products/[id]` URLs (preserve seeded ids) |
| name | text | Title |
| display_name | text | optional |
| description | text | short desc (listing) |
| long_description | text | detail / SEO body |
| category_id | FK → categories | required |
| type | text | `Disposable` \| `Reusable` |
| color | text | optional |
| dimensions | text | sizes string |
| unit | text | optional |
| badge | text | optional |
| price | text | display / box-per-piece style string |
| price_tiers | jsonb | `[{ quantity, price, perPiece? }]` |
| images | text[] | Storage public URLs (WebP) |
| video_url | text | nullable |
| is_published | boolean | default true |
| created_at / updated_at | timestamptz | |

Indexes: `category_id`, `is_published`, `name` (optional trigram later).

### Storage

- Bucket: `product-media` (public read)
- Paths: `products/{productId}/{uuid}.webp`, `products/{productId}/video.{ext}`
- RLS: public read; write only via service role (API)

---

## 2. Media pipeline (WebP)

On admin image upload (API):

1. Accept image MIME types only (jpeg/png/webp/gif); max size limit (e.g. 8–10MB)
2. Convert with **sharp** to WebP (~quality 80, strip metadata)
3. Upload to Storage; append public URL to `products.images`
4. Support reorder + delete image (remove from array; optional Storage delete)
5. Video: validate type/size; upload without conversion; or accept external URL

Existing seeded images may remain as current `/…` public paths until optionally re-uploaded; **new** uploads always WebP.

---

## 3. Admin CMS (`/ziyah-admin`)

### Products tab

- List: thumb, name, category, published, actions (edit / delete)
- Form fields: title, display name, short + long description, category select, type, color, dimensions/sizes, unit, badge, display price, price-tier editor, multi-image upload/reorder/remove, video upload or URL, publish toggle
- Create / update / delete via API
- Ability to **add a new category** from product form (inline create) or Categories tab

### Categories tab

- CRUD: name, slug (auto from name, editable), description, sort_order
- Delete blocked while products still reference the category (or require reassignment)

### Security

- UI gated by existing `AuthGuard`
- Write APIs require admin session proof (cookie/header consistent with login) + use service-role server client
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client

---

## 4. Public SSR / SEO

- `/products` and `/products/[id]`: load published products from Supabase on the server
- ISR: `revalidate` ≈ 60 seconds; on admin save call `revalidatePath` for list + affected detail
- `generateMetadata` from DB name/description/images
- Keep Product JSON-LD / ItemList patterns; source fields from DB
- Descriptions and primary images present in initial HTML
- Configure `next.config` `images.remotePatterns` for Supabase Storage host
- Category filters and landings use `categories` + product relations (update `getCategoryHref` / landing pages to DB or shared server helpers)
- `ProductSearch` and home category links read from the same server/data helpers (no stale static list)

After cutover: `src/data/products.ts` used only by a **seed script**, then marked deprecated / removed from runtime imports.

---

## 5. Seed & rollout

1. SQL migration for tables + bucket policies  
2. Seed categories from current catalog names (+ landing copy from `categories.ts` where useful)  
3. Seed products with **same numeric ids** so existing URLs keep working  
4. Point storefront + search at DB  
5. Ship admin Products/Categories + upload WebP pipeline  
6. Verify view-source SEO on a product detail page  

### Rollback

- Temporary env flag to fall back to static module only if needed during cutover (optional); default path is DB-only once seeded.

---

## Error handling & edge cases

| Case | Handling |
| --- | --- |
| Empty catalog | Products page empty state; no crash |
| Unpublished product | 404 on detail; hidden from list/search |
| Invalid image upload | 400 with clear message; no partial DB write for that file |
| Category delete with products | 409 / blocked |
| Storage failure mid-upload | Return error; do not orphan DB rows without URLs |
| Missing service role / Supabase | Admin writes fail loudly; public may show empty or error boundary |

## Testing checklist

- [ ] Seed preserves product URLs `/products/{id}`
- [ ] Admin create product with images → Storage shows `.webp`
- [ ] Admin edit tiers, description, reorder images, delete product
- [ ] Admin create category; assign to product; filters show new category
- [ ] Public list/detail SSR: description + image URLs in HTML / metadata
- [ ] JSON-LD still valid shape
- [ ] Search finds DB products
- [ ] Unpublished products not listed
- [ ] AuthGuard required for CMS UI; unauthenticated write API rejected

## Out of scope (later)

- Supabase Auth multi-user roles  
- Automatic re-encode of legacy non-WebP assets  
- Video transcoding / thumbnails  
- Visitor-facing product submissions  
- Full redesign of products filter UI (minimalist mobile filter polish can follow)
