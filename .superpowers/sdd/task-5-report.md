# Task 5 Report: Final polish + checklist

**Branch:** `feature/home-minimalist-editorial`  
**Date:** 2026-09-10  
**Status:** DONE — final-review fixes applied

## Summary

Initial pass: checklist and grep guardrails clean. Follow-up: applied Important fixes from whole-branch review (category grid alignment, orphan spans, hero scrim, CSS cleanup).

## Spec Checklist

| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | First viewport = brand + headline + one line + CTA group | ✓ | `BrandWordmark` → H1 “Buy Food Packaging” → one `heroDesc` → `btnPrimary` + `btnText` |
| 2 | No promo slider / marquee on home | ✓ | No `PromoBannerSlider` / `PromoMarquee` import or mount in `page.tsx` |
| 3 | Hero wordmark dominant; nav brand present | ✓ | Hero: `BrandWordmark variant="onDark" size="lg"`; nav: `Navbar.tsx` keeps `BrandWordmark variant="onLight" size="sm"` |
| 4 | Color on-brand, not sterile; CTA/hero carry heat | ✓ | Hero brand wash + accent glow; `btnPrimary` accent; `ctaBanner` primary gradient |
| 5 | Categories / Why / Feedback / CTA / Info present, quieter | ✓ | All sections mounted; flat category grid, numbered why points, quieter feedback CSS |
| 6 | Motions work; reduced motion respected | ✓ | Hero `heroRise` + `@media (prefers-reduced-motion: reduce)`; `HomeScrollEffects` skips IO when reduced; feedback CSS overrides |
| 7 | Mobile + desktop layout; links route | ✓ | Responsive rules at 768px / 540px; category, CTA, quote, contact, product hrefs intact |
| 8 | Metadata / JSON-LD intent preserved | ✓ | `metadata` export unchanged; `localBusinessLd`, `categoryListLd`, `sitelinksLd` scripts present |

## Grep Guardrails

```powershell
rg -n "PromoBannerSlider|PromoMarquee" src/app/page.tsx
# (no matches)

rg -n "heroBadge|categoryIcon|plus-sign|M36 34v-4" src/app/page.module.css src/app/page.tsx
# (no matches)

rg -n "BrandWordmark" src/app/page.tsx
# 7:import BrandWordmark …
# 210:<BrandWordmark variant="onDark" size="lg" />
```

**Expected:** no promo/badge/icon/grid matches; BrandWordmark present — **PASS**

## Lint

```powershell
npm run lint
# Exit 1 — pre-existing Next.js CLI error: Invalid project directory: C:\website\lint

npx eslint src/app/page.tsx
# PASS (0 errors)

npx eslint src/app/components/FeedbackSection.tsx
# 1 pre-existing error (setState in effect) — out of scope (TSX not in Task 5 touch list)
```

## Files Modified

- `src/app/page.module.css`
- `src/app/components/FeedbackSection.module.css`
- `.superpowers/sdd/task-5-report.md`

## Fixes Applied

### Final-review Important fixes (2026-09-10)

1. **Category grid hairline alignment** — Replaced per-card `margin-right: 32px` with `column-gap: 32px` on `.categoryGrid`; normalized `.categoryCard` padding to `28px 0`; removed obsolete `.categoryCard::before { display: none }`.
2. **Orphan fifth category** — Added `.categoryCard:last-child:nth-child(odd) { grid-column: 1 / -1; }` so the 5th category spans full width on desktop.
3. **Feedback orphan half-rule** — Added equivalent `.card:last-child:nth-child(odd)` span in `FeedbackSection.module.css`. API path already slices to 4; fallback data has 4 reviews — CSS is defensive only, no TSX change.
4. **Hero scrim readability** — Desktop `.heroScrim` mid stops tightened: `0.88→0.90` at 26%, `0.48→0.55` at 48% (left-side title/desc readability without heavy scrim).

### Optional minors

- Removed unused `.btnOutline` from `page.module.css` (not referenced in `src/`).
- Removed redundant `border-top: none` on `.whyCard`.
- Added trailing newline to `page.module.css`.

## Placeholder Scan

No TBD / TODO / “implement later” in `page.tsx`, `page.module.css`, or `FeedbackSection.module.css`.

## Verification

```powershell
npx eslint src/app/page.tsx
# PASS (0 errors)

npx eslint src/app/components/FeedbackSection.tsx
# 1 pre-existing error (setState in effect) — unchanged, out of scope
```

- No production build run (per constraints).
- Visual browser review not run — recommend spot-check category grid hairlines (5th card full-width), hero scrim over scene, feedback grid on fallback path.

## Notes / Concerns

- Feedback orphan CSS is defensive; live path always shows 4 cards (API slice + 4-item fallback).
- Hero scrim tweak is modest; user should confirm scene still visible on desktop.

## Commits

None (per task constraint).
