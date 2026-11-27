# Task 2 Report: Hero visual — quiet scene, expressive brand color

**Branch:** `feature/home-minimalist-editorial`  
**Date:** 2026-09-10  
**Status:** DONE

## Summary

Implemented hero and button CSS in `src/app/page.module.css` per the task brief: quieter brand wash background, soft vignette overlay (plus-grid removed), softened scrim for scene visibility, updated hero typography/actions, new `.btnText` text-link CTA styling, and cleanup of unused hero classes. No markup changes; no commits.

## Files Modified

| File | Action |
|------|--------|
| `src/app/page.module.css` | Modified |

## Changes Applied

### Step 1: Hero background / overlay

- **`.hero`** — Replaced rainbow 5-stop gradient with quieter 3-stop wash (`#1b1931 → #2f1f34 → #662249`); stronger accent radial glows (orange 0.28, burgundy 0.35); reduced min-height to `clamp(520px, 82vh, 760px)`; padding bottom `72px`.
- **`.heroOverlay`** — Removed plus-grid SVG; replaced with soft bottom vignette + top fade gradients.
- **`.heroScrim`** — Slightly softened opacity stops (0.97→0.94, 0.92→0.88, 0.55→0.48, 0.18→0.14, 0.04→0.03) so fulfillment scene peeks through on desktop while text stays readable.

### Step 2: Hero type + actions

- **`.heroTitle`** — Larger clamp (32–52px), weight 700, tighter line-height, updated animation delay (0.1s).
- **`.heroTitle span`** — Deleted (Task 1 already removed markup).
- **`.heroDesc`** — Updated size, color, max-width (440px), spacing, animation delay (0.16s).
- **`.heroActions`** — Added `align-items: center`, gap 20px, animation delay 0.22s.
- **`.btnText` / `.btnText:hover`** — Added text-link secondary CTA with underline border treatment.
- **Deleted:** `.heroBadge`, `.heroSteps`, `.heroSteps li` (unused after Task 1 markup slimming).

### Reduced motion

- Removed `.heroBadge` and `.heroSteps` from `@media (prefers-reduced-motion: reduce)` block; `.heroActions` still covered (covers `.btnText` via parent).

### Unchanged (per brief)

- `src/app/page.tsx` — not modified
- `.heroScene`, `.heroInner`, `.heroContent`, `.heroBrand`, `.btnPrimary` — kept as-is
- Mobile responsive hero/scrim/scene rules — preserved

## Verification

### Negative check (removed patterns)
```powershell
rg -n "heroBadge|heroSteps|svg\+xml" src/app/page.module.css
```
**Result:** No matches ✓

### Positive check (expected patterns)
```powershell
rg -n "\.btnText|radial-gradient\(ellipse 90%|linear-gradient\(160deg" src/app/page.module.css
```
**Result:** All present ✓

### Markup/CSS alignment
```powershell
rg -n "heroBadge|heroSteps|heroTitle span" src/
```
**Result:** No matches ✓

### Lint
- `read_lints` on `page.module.css` — no issues ✓
- `npm run lint` — failed with pre-existing Next.js CLI error (`Invalid project directory: C:\website\lint`); unrelated to this change

### Dev server
- Skipped (brief allows optional dev verify; targeted grep + lint checks used instead)

## Self-Review

| Requirement | Met |
|-------------|-----|
| Quieter brand wash, expressive (not flat) | ✓ |
| Plus-grid overlay removed | ✓ |
| Soft vignette overlay | ✓ |
| Scene still visible (scrim softened) | ✓ |
| `.btnText` text-link CTA styled | ✓ |
| `.heroBadge` / `.heroSteps` deleted | ✓ |
| `.heroTitle span` rules removed | ✓ |
| `prefers-reduced-motion` updated | ✓ |
| Task 1 markup untouched | ✓ |
| CSS-only scope | ✓ |
| No commit | ✓ |

## Notes for Downstream Tasks

- **`.whyIndex`** styling still undefined — expected for a later section-polish task.
- Mobile `@media (max-width: 540px)` still sets `.heroActions { flex-direction: column }` — stacks CTAs on small screens; may want horizontal alignment review in a responsive pass.
- `.btnOutline` retained for other pages/sections but no longer used in hero.

## Commits

None (skipped per plan constraint and user rule).
