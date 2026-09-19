# CMS Product Color Picker — Design

**Date:** 2026-09-19  
**Status:** Approved  
**Scope:** Ziyah Admin Products CMS + storefront swatch rendering  
**Related:** [CMS Product Live Preview](./2026-09-19-cms-product-live-preview-design.md)

## Goal

Let product uploaders set **named colors** (Clear, Black, Red & Black, custom, …) with a **Photoshop-like color picker** (browser native color spectrum + hex), support **combined / dual colors** as split swatches, and **link sibling products** via a shared variant group so the visitor PDP shows multiple color swatches.

## Decisions (approved)

| Decision | Choice |
| --- | --- |
| Picker model | **A — Single + optional dual**: name, primary hex, optional secondary hex, presets |
| Picker UI | Native `<input type="color">` + editable `#hex` (no new library) |
| Sibling colors | **Variant group** text field shared across products |
| Combo swatches | Driven by **secondary hex** (not hardcoded name-only `"Red & Black"`) |

## Non-goals

- One-click “create all color variants” wizard (still create/edit each product; same `variant_group`)
- Custom canvas HSV wheel or third-party picker packages
- Changing how variant navigation works on the PDP (still route to sibling product id)

## UX (Products CMS form)

Replace the plain **Color** text input with a **Color** block:

1. **Presets** (row of chips / mini-swatches)  
   - Clear → name `Clear`, hex `#dce8ef`  
   - Black → `Black`, `#1c141f`  
   - Red → `Red`, `#e53935`  
   - Red & Black → name `Red & Black`, primary `#e53935`, secondary `#1c141f`, combined **on**  
   - White → `White`, `#ffffff`  
   - Custom → focus name + pickers (no forced hex)

2. **Color name** — text field (what visitors see: `Color: …`).

3. **Primary color** — `<input type="color">` + `#rrggbb` text + live circle preview.

4. **Combined color** — checkbox. When on:  
   - Show **Secondary color** picker (same controls).  
   - Live preview becomes a **split circle** (left = primary, right = secondary).  
   - Hint under name when name is `Red & Black`: optional note “(red outside, black inside)” already used on PDP can remain name-based.

5. **Variant group** — text input + help: “Products with the same key appear as color swatches together.”  
   - Optional select: “Use existing group…” listing distinct `variant_group` values from loaded products.

## Data model

### Existing (keep)

- `catalog_products.color` (text)  
- `catalog_products.color_hex` (text) — **primary**  
- `catalog_products.variant_group` (text)

### New

- `catalog_products.color_hex_secondary` `text null`  
  Migration: `supabase/migrations/20260919_product_color_secondary.sql`  
  App: `Product.colorHexSecondary?: string`, `ProductWriteInput`, admin API body, `mapProduct` / `toDbProductPayload`.

### Backfill

- Where `color = 'Red & Black'` and secondary is null: set `color_hex_secondary = '#1c141f'` and ensure primary is `#e53935` if empty (seed/script or one-shot in migration `UPDATE`).

## Storefront changes

`ProductPurchasePanel` (and any swatch helper):

- Treat as **combo** when `colorHexSecondary` is set (trim non-empty).  
- Combo background: `linear-gradient(to right, primary 0 50%, secondary 50% 100%)` via inline style (or CSS variables), so any dual pair works—not only Red & Black.  
- Keep optional hint when `color === "Red & Black"`.  
- Single-color products continue to use `background: colorHex`.

## CMS save / load

- Form state adds: `colorHex`, `colorHexSecondary`, `variantGroup`, `combinedColor` (UI-only derived from secondary presence, or explicit checkbox synced on load).  
- On save: send `colorHex`, `colorHexSecondary` (null if combined off), `variantGroup`.  
- Admin list can show a tiny swatch using primary/secondary (optional polish).

## Live preview integration

When live preview is enabled, mapped `Product` includes `color`, `colorHex`, `colorHexSecondary`, `variantGroup`. Preview panel may show **only this product’s swatch** unless siblings are passed; optional later: pass other loaded products with the same `variantGroup` as `variants` so the preview shows the full swatch row (recommended if cheap—filter `products` already in `ProductManager` memory).

## Accessibility

- Color inputs labeled (“Primary color”, “Secondary color”).  
- Hex fields accept paste; invalid hex falls back to last valid or `#cccccc`.  
- Preset buttons have accessible names.  
- Combined checkbox has clear label.

## Testing (manual)

1. New product → preset Clear → name + hex fill; native picker changes hex + preview circle.  
2. Preset Red & Black → combined on, split preview; save; PDP shows split swatch.  
3. Custom dual (e.g. blue + gold) → split works without special name.  
4. Two products same `variant_group` → PDP shows multiple swatches and navigates.  
5. Combined off clears secondary on save.  
6. Live preview (if built) updates swatch as hex changes.

## Risks

| Risk | Mitigation |
| --- | --- |
| Old Red & Black hardcode left in place | Replace with secondary-hex rule; backfill rows |
| Invalid hex from typing | Normalize on blur; constrain color input |
| Empty variant group | Allowed; single swatch only |

## Implementation order (with live preview)

1. Migration + types + map/API for `color_hex_secondary`  
2. Storefront combo swatch by secondary hex + backfill  
3. CMS color UI (presets, pickers, variant group)  
4. Live preview (includes color mapping + optional sibling variants)
