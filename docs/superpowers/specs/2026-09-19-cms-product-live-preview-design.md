# CMS Product Live Preview — Design

**Date:** 2026-09-19  
**Status:** Approved  
**Scope:** Ziyah Admin Products CMS form only (`ProductManager`)

## Goal

When creating or editing a product, show a **toggleable live visual reference** that mirrors the **visitor product detail page**. As the uploader edits fields (title, About, FAQs, images, prices, etc.), the preview updates immediately with a short soft animation so they can see where each piece of data lands.

## Decisions (approved)

| Decision | Choice |
| --- | --- |
| Layout | **A — Side-by-side**: form left, sticky preview right |
| Implementation | **Reuse real PDP components** (`ProductGallery`, `ProductPurchasePanel`, `ProductSeoSections`) fed by a form→`Product` mapper |
| Toggle | Explicit enable/disable; persist in `localStorage` |
| Default | On for viewports ≥900px; off below (form stays usable on phones) |

## Non-goals

- No real inquiry / add-to-queue side effects in preview
- No related-products grid (omit or show empty; avoid catalog fetch noise)
- No JSON-LD / SEO meta in preview
- No separate preview URL or iframe
- Video remains out of scope (already disabled on products)

## UX

### Toggle

- Control labeled **“Show product preview”** in the form header (near “Back to list”).
- Key: `ziyah-admin-product-preview` in `localStorage` (`"1"` / `"0"`).
- When **off**: form uses full content width (current layout).
- When **on**: split layout — form ~52%, preview ~48% (approx.); preview column `position: sticky` within the admin card scroll context so it stays visible while scrolling the form.

### Preview chrome

- Small label: **“Visitor view (live)”** so editors know it is a reference, not a second form.
- Scrollable preview body if content is taller than the viewport.
- Soft text transitions (~150–200ms opacity/translate) when mapped title / description strings change (CSS or a tiny `key`/`data-flash` on the heading). Prefer CSS over new animation libraries.

### Field → PDP mapping

| CMS field | Visitor UI location |
| --- | --- |
| Title (`name`) | Gallery alt, Key features “Product”, purchase fallback |
| Display name | Breadcrumb end, purchase title, SEO headings |
| Short description | Key features product line / purchase short copy |
| About / About extra | About section paragraphs |
| Best for | Key features “Best for” row |
| Specs | Key features list rows |
| FAQs | FAQ accordion (empty → same auto-generated FAQs as storefront) |
| Category | About heading (“About this {category}”), badges |
| Type / Color / Sizes | Purchase panel + features |
| Display price / tiers | Purchase panel pricing |
| Images (cover first) | Gallery + cover thumb |
| Published | Not shown in preview (admin-only) |

Placeholder copy when fields are empty (e.g. “Product title”) so the layout still reads as a PDP.

## Technical design

### New pieces

1. **`formToPreviewProduct(form, categoryName): Product`**  
   Pure mapper in `src/app/ziyah-admin/previewProduct.ts` (or under `src/lib/catalog/`). Builds a valid `Product` from `FormState` (id `0` or existing id; badge from type; filter blank FAQ/spec rows for display consistency with save rules).

2. **`ProductLivePreview` client component**  
   `src/app/ziyah-admin/ProductLivePreview.tsx`  
   Renders a scaled/contained clone of the PDP structure using `detail.module.css`:
   - Breadcrumb (non-navigating spans/links with `tabIndex={-1}` or `#` prevented)
   - `ProductGallery`
   - `ProductPurchasePanel` with `variants={[]}`
   - `ProductSeoSections` with `related={[]}`

3. **CSS** in `admin.module.css`  
   - `.formWithPreview` grid / flex split  
   - `.livePreviewPane` sticky column  
   - Avoid reusing existing `.preview` (already used for inquiry table ellipsis)

### Purchase panel / queue isolation

`ProductPurchasePanel` uses `useProductQueue` and `useRouter`. Preview must not mutate the real inquiry queue or navigate away.

**Approach:** Add an optional `previewMode?: boolean` prop to `ProductPurchasePanel`:

- When `true`: disable “Add to queue” / inquire navigation (buttons become inert or show a toast-less no-op); color variant clicks do nothing.
- Gallery stays interactive for image switching only.

Alternatively wrap preview in a no-op queue context if one already exists; prefer the explicit `previewMode` flag for clarity.

### Integration in `ProductManager`

- State: `showPreview` initialized from `localStorage` + matchMedia.
- When `mode === "form"` and `showPreview`: render form + `<ProductLivePreview product={mapped} />`.
- `useMemo` map from `form` + selected category name.
- Toggle only visible in form mode (not list).

### Responsive

- Below ~900px: if user enables preview, stack preview **above** or **below** the form (full width), not side-by-side. Sticky optional.
- Respect stored preference when resizing.

## Accessibility

- Toggle is a real checkbox or `button` with `aria-pressed`.
- Preview region: `aria-label="Live visitor product preview"` and `aria-live="polite"` only if it does not spam (prefer updating without aggressive live regions; title change alone is enough visually).
- Decorative preview links are not in the tab order when inert.

## Testing (manual)

1. Open New product → preview on → type Title → heading updates live.  
2. Fill About / FAQ / tiers / upload image → sections update.  
3. Toggle off → form full width; toggle on → split returns; preference survives refresh.  
4. Narrow viewport → stacked layout; queue buttons in preview do not add real queue items.  
5. Edit existing product → preview matches current fields including cover image.

## Risks

| Risk | Mitigation |
| --- | --- |
| Admin CSS bleeds into PDP styles | Scope preview under `.livePreviewPane`; import `detail.module.css` only inside preview components (already CSS modules) |
| Queue pollution | `previewMode` no-ops |
| Heavy re-renders while typing | Memoize mapped product; gallery keyed by images join |

## Out of follow-up (optional later)

- Highlight/pulse the PDP region that corresponds to the focused form field  
- Push keep-alive workflow (separate; needs `workflow` token scope)
