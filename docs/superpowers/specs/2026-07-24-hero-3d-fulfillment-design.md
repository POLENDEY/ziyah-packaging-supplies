# Hero 3D Fulfillment Scene Design

**Date:** 2026-07-24  
**Status:** Approved  
**Approach:** Lightweight Three.js client scene (no Spline)

## Goal

Redesign the home Hero into a premium SaaS-style section with a looping 3D order-fulfillment animation (pack → courier pickup → delivery) that autoplays without harming LCP.

## Decisions

| Topic | Choice |
| --- | --- |
| 3D tech | `three` (vanilla), client-only |
| Load strategy | Dynamic import `ssr: false` + mount after paint |
| Motion | Infinite loop; static frame if `prefers-reduced-motion` |
| Scope | Hero only — copy/CTAs preserved |
| Layout | Two-column: brand/copy left, 3D stage right; stack on mobile |

## Architecture

```
page.tsx (server)
  └─ Hero section
       ├─ copy + CTAs (entrance CSS)
       └─ dynamic(HeroFulfillmentScene) → canvas Three.js loop
```

## Non-goals

- Spline / external 3D CDN
- Changing products, navbar, or promo sections
- Full R3F stack (keep deps minimal)

## Acceptance

- Autoplay loop on load (when motion allowed)
- Responsive desktop/tablet/mobile
- Brand plum/coral look, clear hierarchy
- No broken CTAs / links
