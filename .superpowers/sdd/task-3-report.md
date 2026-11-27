# Task 3 Report: Editorial mid-page sections (categories, why, CTA, info)

**Branch:** `feature/home-minimalist-editorial`  
**Date:** 2026-09-10  
**Status:** DONE

## Summary

Restyled categories, why, info, and section headers per the task brief. Categories are flat editorial links (no card chrome); why points use numbered `01`–`04` indices; info strip is quieter with unboxed accent icons; CTA banner brand gradient retained as the color beat. Section headers shortened in markup.

## Files Modified

| File | Action |
|------|--------|
| `src/app/page.module.css` | Modified |
| `src/app/page.tsx` | Modified (section header copy only) |

## Changes Applied

### Step 1: Categories — flat links

- **`.sectionHeader`** — Left-aligned, tighter spacing, smaller type scale.
- **`.categoryGrid`** — 2-column list with top/bottom borders, no gap.
- **`.categoryCard`** — Transparent, borderless cards; hover slides right (`translateX(4px)`); `::before` accent bar disabled.
- **`.categoryArrow`** — Margin-top 14px.
- **Deleted:** `.categoryIcon` rules.

### Step 2: Why + info + responsive

- **`.whyGrid`** — 2-column editorial grid, wider gaps.
- **`.whyCard`** — No top accent border, zero padding.
- **`.whyIndex`** — Added numbered index styling (accent, letter-spaced).
- **Deleted:** `.whyIcon` rules.
- **`.infoStrip`** — White background, 48px padding.
- **`.infoIcon`** — Unboxed 36px accent icons (transparent bg, no radius).
- **`.ctaBanner`** — Unchanged (brand gradient retained).
- **Responsive** — At 768px: categories and why single column; removed 1024px why breakpoint. At 540px: hero actions column with full-width primary only.

### Step 3: Section header copy

- Categories H2 → `Shop by Category`; P → shorter wholesale/takeout line.
- Why H2 → `Why food businesses choose Ziyah`; P → food-grade / flexible orders / delivery line.

### Unchanged (per brief)

- Hero CSS (Task 2)
- CTA markup and `.ctaBanner` gradient
- `FeedbackSection` mount position
- Category/why data arrays and links

## Verification

### Structure checks
```powershell
rg -n "categoryIcon|whyIcon" src/
```
**Result:** No matches ✓

```powershell
rg -n "\.whyIndex|border-top: 1px solid rgba\(27, 25, 49" src/app/page.module.css
```
**Result:** Present ✓

### Lint
- `read_lints` on `page.tsx`, `page.module.css` — no issues ✓
- `npm run lint` — failed with pre-existing Next.js CLI error (`Invalid project directory: C:\website\lint`); unrelated to this change

## Self-Review

| Requirement | Met |
|-------------|-----|
| Flat category links (no icon cards) | ✓ |
| Why uses `01`–`04` via `.whyIndex` | ✓ |
| CTA brand gradient retained | ✓ |
| Info icons unboxed | ✓ |
| Section headers shortened | ✓ |
| Task 1–2 hero/markup preserved | ✓ |
| No promos remounted | ✓ |
| No commit | ✓ |

## Notes for Downstream Tasks

- Five category items in a 2-column grid leaves one orphan row on desktop — intentional editorial list behavior.
- `.btnOutline` still in CSS for other pages; hero 540px rule no longer forces `.btnOutline` full-width.

## Commits

None (skipped per plan constraint).
