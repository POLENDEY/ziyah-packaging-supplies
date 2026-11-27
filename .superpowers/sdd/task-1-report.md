# Task 1 Report: Slim homepage structure (markup)

**Branch:** `feature/home-minimalist-editorial`  
**Date:** 2026-09-10  
**Status:** DONE

## Summary

Implemented markup-only changes to `src/app/page.tsx` per the task brief: slimmed hero content, removed promo component mounts, flattened category and why-us sections. No CSS changes; no commits (per plan constraint).

## Files Modified

| File | Action |
|------|--------|
| `src/app/page.tsx` | Modified |

## Changes Applied

### Imports removed
- `PromoMarquee`, `PromoBannerSlider`
- Unused icons: `IconBento`, `IconPackage`, `IconSushi`, `IconTray`, `IconCheck`, `IconList`, `IconFactory`, `IconTruck`

### Imports kept
- `IconArrowRight`, `IconMapPin`, `IconPhone`, `IconMail`, `IconClock`
- `BrandWordmark`, `HeroFulfillmentScene`, `FeedbackSection`, `HomeScrollEffects`, `SITE` data

### Data arrays
- `categories` — plain objects (`name`, `desc`, `href`); no `Icon` field
- `whyUs` — plain objects (`title`, `desc`); no `Icon` field

### Hero section
- Kept `heroScene`, `heroScrim`, `heroOverlay`, `heroInner` wrappers
- Kept `BrandWordmark` in `heroBrand` wrapper
- Removed `heroBadge` div
- Simplified `h1` to plain "Buy Food Packaging" (removed dual-tone `<span>`)
- Updated hero description copy per brief
- Changed quote CTA from `btnOutline` to `btnText`

### Promo mounts
- Removed both `<PromoBannerSlider />` and `<PromoMarquee />` wrapper divs entirely

### Category section
- Removed `categoryIcon` wrapper and dynamic icon rendering
- Cards now: `h3`, `p`, `categoryArrow` only

### Why section
- Removed `whyIcon` circular icon boxes
- Added numbered `whyIndex` accent (`01`–`04`) with `aria-hidden="true"`

### Preserved (unchanged structurally)
- All three JSON-LD `<script>` blocks
- `HomeScrollEffects`
- Section headers (left as-is; optional shortening not applied)
- `FeedbackSection`, CTA banner, info strip

### Component files NOT deleted
- `src/app/components/PromoMarquee.tsx` (+ `.module.css`) — still present, unmounted only
- `src/app/components/PromoBannerSlider.tsx` (+ `.module.css`) — still present, unmounted only

## Verification

### Negative check (removed patterns)
```powershell
rg -n "PromoBannerSlider|PromoMarquee|heroBadge|categoryIcon|whyIcon" src/app/page.tsx
```
**Result:** No matches ✓

### Positive check (expected patterns)
```powershell
rg -n "BrandWordmark|btnText|whyIndex|FeedbackSection" src/app/page.tsx
```
**Result:** All present ✓
- Line 4: `FeedbackSection` import
- Line 7: `BrandWordmark` import
- Line 210: `<BrandWordmark variant="onDark" size="lg" />`
- Line 221: `className={styles.btnText}`
- Line 265: `className={styles.whyIndex}`
- Line 277: `<FeedbackSection />`

### Lint
- No linter errors on `src/app/page.tsx`

## Self-Review

| Requirement | Met |
|-------------|-----|
| Markup-only; no CSS redesign | ✓ |
| Hero slimmed per brief | ✓ |
| Promo mounts removed, component files kept | ✓ |
| Categories without icon boxes | ✓ |
| Why with numbered index, no icon boxes | ✓ |
| JSON-LD + HomeScrollEffects preserved | ✓ |
| BrandWordmark in hero preserved | ✓ |
| No commit | ✓ |

## Notes for Downstream Tasks

- **`btnText`** and **`whyIndex`** CSS classes are referenced in markup but not yet defined in `page.module.css` — expected; Task 2 handles hero/section visual polish.
- **`heroBrand`** class remains in markup (brief keeps the wrapper); verify negative check intentionally excludes it.
- Quote link styling will appear unstyled/minimal until Task 2 adds `.btnText` rules.

## Commits

None (skipped per plan constraint and user rule).
