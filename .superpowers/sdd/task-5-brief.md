### Task 5: Final polish + checklist

**Files:**
- Touch only if gaps found: `src/app/page.tsx`, `src/app/page.module.css`, `src/app/components/FeedbackSection.module.css`

- [ ] **Step 1: Spec checklist pass**

Walk `docs/superpowers/specs/2026-09-10-home-minimalist-editorial-design.md` testing checklist:

1. First viewport = brand + headline + one line + CTA group
2. No promo slider / marquee on home
3. Brand wordmark dominant in hero; nav brand still present
4. Color on-brand, not sterile; CTA/hero carry heat
5. Categories / Why / Feedback / CTA / Info present and quieter
6. Motions work; reduced motion respected
7. Mobile + desktop OK; links route
8. Metadata / JSON-LD unchanged in intent

- [ ] **Step 2: Grep guardrails**

```bash
rg -n "PromoBannerSlider|PromoMarquee" src/app/page.tsx
rg -n "heroBadge|categoryIcon|plus-sign|M36 34v-4" src/app/page.module.css src/app/page.tsx
rg -n "BrandWordmark" src/app/page.tsx
```

Expected: no promo/badge/icon/grid matches; BrandWordmark present.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: pass (or only pre-existing unrelated warnings).

- [ ] **Step 4: Offer user review of `/` in browser**

Do not run `npm run build` unless explicitly requested.

---

## Spec coverage self-review

| Spec requirement | Task |
| --- | --- |
| Editorial minimal page flow | 1 |
| Unmount promo slider + marquee | 1 |
| Hero brand wordmark + one H1 + one line + primary CTA + text quote link | 1–2 |
| Remove location pill + plus-grid | 1–2 |
| Expressive brand color (hero wash + CTA beat) | 2–3 |
| Flat categories | 1, 3 |
| Why without icon cards | 1, 3 |
| Quieter feedback | 4 |
| CTA + info strip | 3 |
| Motion + reduced motion | 2 (keep existing scroll effects) |
| Home-only / no new deps | All |
| SEO JSON-LD preserved | 1 (do not remove scripts) |

## Placeholder scan

No TBD / TODO / “implement later” left in tasks.
