# Home & Product UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship navbar product search, video-first product galleries, chatbot Messenger/tone cleanup, curated animated feedback, and a home promo banner slider.

**Architecture:** Static data modules (`products`, `reviews`, `promos`) plus focused client components integrated into Navbar and Home. No new backend.

**Tech Stack:** Next.js App Router, React client components, CSS modules, HTML video, pointer/touch drag carousel.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-23-home-product-ux-design.md`
- Sample video: `https://www.w3schools.com/html/movie.mp4`
- No Messenger push inside chatbot; positive fallback only
- Curated reviews only; branded promo placeholders
- Honor `prefers-reduced-motion`

## File map

| File | Responsibility |
| --- | --- |
| `src/data/products.ts` | Add `video?` per product |
| `src/data/reviews.ts` | Curated feedback data |
| `src/data/promos.ts` | Promo banner slides |
| `src/app/components/ProductSearch.tsx` | Live search dropdown |
| `src/app/components/Navbar.tsx` | Host search |
| `src/app/products/[id]/ProductGallery.tsx` | Video-first slider |
| `src/app/components/ChatBot.tsx` | Copy + remove Messenger CTA |
| `src/app/components/FeedbackSection.tsx` | Animated reviews |
| `src/app/components/PromoBannerSlider.tsx` | Autoplay/drag promo carousel |
| `src/app/page.tsx` | Mount feedback + promo |

## Tasks

### Task 1: Product video data + gallery
- [x] Add `video?: string` and sample URL to all products
- [x] Update ProductGallery for video-first slides
- [x] Pass `video` from detail page

### Task 2: Navbar product search
- [x] Build ProductSearch with live results (image + name)
- [x] Integrate into desktop + mobile Navbar

### Task 3: Chatbot cleanup
- [x] Remove Messenger button and Messenger-heavy answers
- [x] Positive fallback without “I am not sure”

### Task 4: Feedback section
- [x] Add `reviews.ts` + FeedbackSection with animated stars
- [x] Mount on home page

### Task 5: Promo banner slider
- [x] Add `promos.ts` + PromoBannerSlider (autoplay, pause, drag)
- [x] Mount on home below hero

### Task 6: Verify
- [x] Smoke-check key routes in dev server
