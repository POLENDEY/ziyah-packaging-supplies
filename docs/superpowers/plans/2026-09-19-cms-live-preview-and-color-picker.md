# CMS Live Preview + Color Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a toggleable side-by-side visitor PDP live preview in Products CMS, plus a native color-wheel / dual-hex / variant-group color editor that drives real storefront swatches.

**Architecture:** Persist `color_hex_secondary` on `catalog_products`; map it through admin APIs and `mapProduct`. Storefront combo swatches use primary+secondary hex (not name hardcoding). CMS gains `ProductColorFields` + `ProductLivePreview` fed by `formToPreviewProduct`. `ProductPurchasePanel` gains `previewMode` to disable queue/navigation.

**Tech Stack:** Next.js App Router, React client components, CSS modules (`admin.module.css`, `detail.module.css`), Supabase/`pg` migration, existing catalog types.

## Global Constraints

- No new color-picker npm dependencies — use `<input type="color">` + hex text.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Product video stays disabled (`video_url` null / not shown).
- Do not run production builds (`npm run build`); verify with lint/dev checks only.
- Prefer recommended options already approved in specs dated 2026-09-19.

## File structure

| File | Responsibility |
| --- | --- |
| `supabase/migrations/20260919_product_color_secondary.sql` | Add + backfill `color_hex_secondary` |
| `scripts/apply-product-color-secondary.cjs` | Apply migration via `DATABASE_URL` |
| `src/data/products.ts` | `colorHexSecondary` on `Product` |
| `src/lib/catalog/types.ts` | DB + write input fields |
| `src/lib/catalog/mapProduct.ts` | Map secondary hex |
| `src/app/api/admin/products/route.ts` + `[id]/route.ts` | Accept `colorHexSecondary`, `variantGroup`, `colorHex` |
| `src/app/products/[id]/ProductPurchasePanel.tsx` | Combo via secondary; `previewMode` |
| `src/app/ziyah-admin/colorPresets.ts` | Preset definitions + hex normalize |
| `src/app/ziyah-admin/ProductColorFields.tsx` | CMS color UI |
| `src/app/ziyah-admin/previewProduct.ts` | Form → `Product` mapper |
| `src/app/ziyah-admin/ProductLivePreview.tsx` | Visitor-style preview pane |
| `src/app/ziyah-admin/ProductManager.tsx` | Wire form state, layout, toggle |
| `src/app/ziyah-admin/admin.module.css` | Split layout + color UI styles |

---

### Task 1: Migration + types + mapper

**Files:**
- Create: `supabase/migrations/20260919_product_color_secondary.sql`
- Create: `scripts/apply-product-color-secondary.cjs`
- Modify: `src/data/products.ts` (`Product` type)
- Modify: `src/lib/catalog/types.ts`
- Modify: `src/lib/catalog/mapProduct.ts`
- Modify: `src/app/api/admin/products/route.ts`
- Modify: `src/app/api/admin/products/[id]/route.ts`

**Interfaces:**
- Produces: `Product.colorHexSecondary?: string`; `ProductWriteInput.colorHexSecondary?; colorHex?; variantGroup?` already partially present — ensure secondary wired end-to-end.

- [ ] **Step 1: Add migration SQL**

```sql
alter table public.catalog_products
  add column if not exists color_hex_secondary text;

update public.catalog_products
set
  color_hex = coalesce(nullif(trim(color_hex), ''), '#e53935'),
  color_hex_secondary = coalesce(nullif(trim(color_hex_secondary), ''), '#1c141f')
where lower(trim(color)) = 'red & black';
```

- [ ] **Step 2: Add apply script** (copy pattern from `scripts/apply-product-seo-fields.cjs`, point at the new SQL file, log `OK color_hex_secondary`).

- [ ] **Step 3: Extend types**

On `Product`:
```ts
colorHexSecondary?: string;
```

On `DbProductRow`:
```ts
color_hex_secondary: string | null;
```

On `ProductWriteInput`:
```ts
colorHexSecondary?: string | null;
```

- [ ] **Step 4: Map in `mapDbProductToProduct` / `toDbProductPayload`**

```ts
colorHexSecondary: row.color_hex_secondary || undefined,
// ...
color_hex_secondary: input.colorHexSecondary?.trim() || null,
```

- [ ] **Step 5: Admin API bodies** — in both POST and PATCH parsers, add:
```ts
colorHex: body.colorHex != null ? String(body.colorHex) : null,
colorHexSecondary:
  body.colorHexSecondary != null ? String(body.colorHexSecondary) : null,
variantGroup:
  body.variantGroup != null ? String(body.variantGroup) : null,
```
(Keep existing fields; ensure secondary reaches `toDbProductPayload`.)

- [ ] **Step 6: Apply migration**

Run (PowerShell, from repo root, with `.env.local` loaded or `DATABASE_URL` set):
```powershell
node -e "const fs=require('fs');for (const l of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){const m=l.match(/^([^#=]+)=(.*)$/);if(m&&!process.env[m[1].trim()])process.env[m[1].trim()]=m[2].trim()}"
node scripts/apply-product-color-secondary.cjs
```
Expected: `OK color_hex_secondary`

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/20260919_product_color_secondary.sql scripts/apply-product-color-secondary.cjs src/data/products.ts src/lib/catalog/types.ts src/lib/catalog/mapProduct.ts src/app/api/admin/products/
git commit -m "Add color_hex_secondary for dual product swatches."
```

---

### Task 2: Storefront combo swatches + previewMode

**Files:**
- Modify: `src/app/products/[id]/ProductPurchasePanel.tsx`
- Modify: `src/app/products/[id]/detail.module.css` (only if CSS vars needed; prefer inline gradient)

**Interfaces:**
- Consumes: `Product.colorHexSecondary`
- Produces: `ProductPurchasePanel({ product, variants, previewMode?: boolean })`

- [ ] **Step 1: Replace name-only combo detection**

```ts
type Props = {
  product: Product;
  variants: Product[];
  previewMode?: boolean;
};

const isComboSwatch = (p: Product) =>
  Boolean(p.colorHexSecondary?.trim());

const swatchStyle = (p: Product): React.CSSProperties | undefined => {
  if (isComboSwatch(p)) {
    const a = p.colorHex || "#e53935";
    const b = p.colorHexSecondary || "#1c141f";
    return {
      backgroundImage: `linear-gradient(to right, ${a} 0 50%, ${b} 50% 100%)`,
    };
  }
  return { background: p.colorHex || "#ccc" };
};
```

Use `swatchStyle(variant)` for both interactive and static swatches; keep `styles.swatchCombo` class when combo for any leftover CSS, or drop hard-coded red/black gradient from `.swatchCombo` so inline style wins.

- [ ] **Step 2: previewMode behavior**

When `previewMode` is true:
- `selectColor` no-ops (do not `router.push`)
- `handleAddToQueue` no-ops
- Inquire / quote `Link` components use `href="#"` and `onClick={(e) => e.preventDefault()}` (or render `<span className={...}>` instead)

- [ ] **Step 3: Manual check** — open a Red & Black PDP; swatch still split. (Dev server.)

- [ ] **Step 4: Commit**

```bash
git add src/app/products/[id]/ProductPurchasePanel.tsx src/app/products/[id]/detail.module.css
git commit -m "Drive combo swatches from secondary hex; add previewMode."
```

---

### Task 3: CMS color fields UI

**Files:**
- Create: `src/app/ziyah-admin/colorPresets.ts`
- Create: `src/app/ziyah-admin/ProductColorFields.tsx`
- Modify: `src/app/ziyah-admin/admin.module.css`
- Modify: `src/app/ziyah-admin/ProductManager.tsx`

**Interfaces:**
- Consumes: form slice `{ color, colorHex, colorHexSecondary, variantGroup }`
- Produces: `ProductColorFields({ value, onChange, existingGroups: string[] })`

- [ ] **Step 1: `colorPresets.ts`**

```ts
export type ColorPreset = {
  id: string;
  label: string;
  color: string;
  colorHex: string;
  colorHexSecondary?: string;
};

export const COLOR_PRESETS: ColorPreset[] = [
  { id: "clear", label: "Clear", color: "Clear", colorHex: "#dce8ef" },
  { id: "black", label: "Black", color: "Black", colorHex: "#1c141f" },
  { id: "red", label: "Red", color: "Red", colorHex: "#e53935" },
  {
    id: "red-black",
    label: "Red & Black",
    color: "Red & Black",
    colorHex: "#e53935",
    colorHexSecondary: "#1c141f",
  },
  { id: "white", label: "White", color: "White", colorHex: "#ffffff" },
];

export function normalizeHex(raw: string, fallback = "#cccccc"): string {
  const t = raw.trim();
  const withHash = t.startsWith("#") ? t : `#${t}`;
  return /^#[0-9a-fA-F]{6}$/.test(withHash) ? withHash.toLowerCase() : fallback;
}
```

- [ ] **Step 2: `ProductColorFields`** — presets row; color name; primary color input + hex; “Combined color” checkbox (checked when secondary non-empty); secondary picker when combined; live split/single circle; variant group text + `<select>` of `existingGroups`.

- [ ] **Step 3: Extend `FormState` / `emptyForm` / `startEdit` / `onSave` payload** with `colorHex`, `colorHexSecondary`, `variantGroup`. Replace plain Color input with `<ProductColorFields />`.

- [ ] **Step 4: Styles** — `.colorPresets`, `.colorSwatchPreview`, `.colorPickerRow`, etc. in `admin.module.css`.

- [ ] **Step 5: Manual check** — edit product, set Red & Black, save, reload form shows dual hex.

- [ ] **Step 6: Commit**

```bash
git add src/app/ziyah-admin/colorPresets.ts src/app/ziyah-admin/ProductColorFields.tsx src/app/ziyah-admin/ProductManager.tsx src/app/ziyah-admin/admin.module.css
git commit -m "Add CMS color presets, dual hex picker, and variant group."
```

---

### Task 4: Live product preview

**Files:**
- Create: `src/app/ziyah-admin/previewProduct.ts`
- Create: `src/app/ziyah-admin/ProductLivePreview.tsx`
- Modify: `src/app/ziyah-admin/ProductManager.tsx`
- Modify: `src/app/ziyah-admin/admin.module.css`

**Interfaces:**
- Consumes: `FormState`, category name, sibling `Product[]` from list with same `variantGroup`
- Produces: `formToPreviewProduct(form, categoryName): Product`; `ProductLivePreview({ product, variants })`

- [ ] **Step 1: `formToPreviewProduct`**

Map form → `Product` with placeholders (`name || "Product title"`, etc.), `badge` from type, `colorHexSecondary` only if trimmed, `faqs` filtered, `images` or placeholder `[ "/dummy-post-square-1.jpg" ]` if empty (use an existing public placeholder path already in repo).

- [ ] **Step 2: `ProductLivePreview`**

```tsx
<div className={styles.livePreviewPane} aria-label="Live visitor product preview">
  <p className={styles.livePreviewLabel}>Visitor view (live)</p>
  <div className={styles.livePreviewFrame}>
    {/* breadcrumb spans */}
    <div className={detailStyles.layout}>
      <ProductGallery ... />
      <ProductPurchasePanel product={product} variants={variants} previewMode />
    </div>
    <ProductSeoSections product={product} related={[]} />
  </div>
</div>
```

Import `detail.module.css` as `detailStyles`. Soft transition on title via CSS class when `product.displayName||product.name` changes (`animation: previewFlash 0.2s ease`).

- [ ] **Step 3: Wire toggle in `ProductManager`**

- State `showPreview` from `localStorage` key `ziyah-admin-product-preview`, default `window.matchMedia("(min-width: 900px)").matches` on first visit.
- Header checkbox/button “Show product preview”.
- When on: wrapper `styles.formWithPreview` — form column + `<ProductLivePreview />`.
- Variants: `products.filter(p => form.variantGroup && p.variantGroup === form.variantGroup)` mapped through preview product for current form replacing matching id.

- [ ] **Step 4: Responsive CSS** — side-by-side ≥900px; stacked below.

- [ ] **Step 5: Manual check** — type title → preview heading updates; toggle persists; queue buttons in preview do not add cart items.

- [ ] **Step 6: Commit**

```bash
git add src/app/ziyah-admin/previewProduct.ts src/app/ziyah-admin/ProductLivePreview.tsx src/app/ziyah-admin/ProductManager.tsx src/app/ziyah-admin/admin.module.css docs/superpowers/plans/2026-09-19-cms-live-preview-and-color-picker.md
git commit -m "Add toggleable live product preview in Products CMS."
```

---

### Task 5: Final verification

- [ ] **Step 1:** Confirm migration applied; Red & Black rows have secondary hex.
- [ ] **Step 2:** CMS create/edit color + variant group + preview toggle paths.
- [ ] **Step 3:** No regressions on inquiries/categories tabs (smoke open).
- [ ] **Step 4:** Commit any leftover plan doc if not already; do not push unless user asks.

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| `color_hex_secondary` + backfill | 1 |
| Combo swatch by secondary hex | 2 |
| Native picker + presets + dual + variant group | 3 |
| Side-by-side live preview + toggle + localStorage | 4 |
| `previewMode` no queue/nav | 2 + 4 |
| Preview maps color fields / optional siblings | 4 |

## Execution

Plan saved to `docs/superpowers/plans/2026-09-19-cms-live-preview-and-color-picker.md`.
