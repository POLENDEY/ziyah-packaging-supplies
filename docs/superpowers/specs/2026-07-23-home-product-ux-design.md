# Home & Product UX Enhancements Design

**Date:** 2026-07-23  
**Status:** Approved for planning  
**Approach:** Lightweight client components + static data files (no new admin/backend)

## Goal

Improve discovery, product media, chatbot tone, social proof, and promotional storytelling on the Ziyah Packaging Supplies site while staying compatible with SSG/SEO.

## Decisions locked

| Topic | Choice |
| --- | --- |
| Feedback & ratings | Curated display-only reviews (no visitor submit form yet) |
| Product search placement | Navbar on all public pages |
| Product video | Per-product `video` field; first gallery slide is video |
| Sample video URL | `https://www.w3schools.com/html/movie.mp4` (replaceable later) |
| Promo banners | Branded placeholder slides (editable in data) |
| Implementation style | Client React components + `src/data/*` content |

## Architecture overview

```
Navbar
  └─ ProductSearch (client) → filters products from src/data/products.ts → Link /products/[id]

Product detail /products/[id]
  └─ ProductGallery (client) → [video, ...images]

Home
  ├─ PromoBannerSlider (client) ← src/data/promos.ts
  └─ FeedbackSection (client) ← src/data/reviews.ts

ChatBot (client)
  └─ FAQ copy cleanup (no Messenger push; positive fallback)
```

Shared data remains static TypeScript modules so pages stay SSG-friendly.

---

## 1. Product search (navbar)

### Behavior

- Search input in desktop navbar and mobile drawer.
- On input, show live results matching product `name`, `category`, and `desc` (case-insensitive).
- Each result row: thumbnail (`images[0]`) + product name (category optional secondary line).
- Click / Enter on a result navigates to `/products/[id]` and closes the menu/dropdown.
- No matches: “No products found” helper text.
- Esc closes dropdown; click outside closes dropdown.

### Components / files

- `src/app/components/ProductSearch.tsx` (+ module CSS)
- Integrate into `Navbar.tsx` / `Navbar.module.css`

### Non-goals

- Full-page search results route
- Server search API / Algolia

---

## 2. Product gallery video-first

### Data

Extend `Product` in `src/data/products.ts`:

```ts
video?: string;
```

Set every product’s `video` to the sample MP4 URL for now.

### Gallery behavior

- Slide list = video (if present) then `images`.
- Index `0` is the video slide when `video` exists.
- Video slide: `<video controls playsInline muted>` with autoplay when the video slide is active; pause when user leaves that slide.
- Thumbnails: video thumb uses a play-indicator overlay; image thumbs unchanged.
- Existing prev/next + thumb selection remain.

### Files

- `src/data/products.ts`
- `src/app/products/[id]/ProductGallery.tsx`
- `src/app/products/[id]/detail.module.css`
- Pass `video` from `page.tsx`

### Non-goals

- Uploading videos via admin
- Multiple videos per product

---

## 3. Chatbot copy / Messenger

### Changes

- Remove the “Continue on Messenger” button from the chatbot UI.
- Remove Messenger suggestions from greeting, price, contact, delivery, social, and fallback replies.
- Keep Messenger links elsewhere (footer, SocialLinks, contact page).
- Replace negative fallback (“I am not sure about that…”) with a helpful redirect to Products, Contact/Quote, or phone — confident, never self-deprecating.
- Price replies continue to point to Products + Contact / Get a Quote (no Messenger).

### Files

- `src/app/components/ChatBot.tsx`
- `src/app/components/ChatBot.module.css` (remove messenger link styles if unused)

---

## 4. Feedback & star ratings (curated, animated)

### Data

New `src/data/reviews.ts`:

- `id`, `name`, `role` (optional), `rating` (1–5), `photo`, `quote`

Use existing public images (e.g. logo / dummy product image) as temporary photos until real customer photos exist.

### UI

- Home section “Customer Feedback” with review cards.
- Animated star fill (stagger) when section enters viewport.
- Card entrance motion (fade/slide); honor `prefers-reduced-motion`.

### Files

- `src/data/reviews.ts`
- `src/app/components/FeedbackSection.tsx` (+ CSS)
- Wire into `src/app/page.tsx`

### Non-goals

- Visitor-submitted reviews
- Database persistence / moderation

---

## 5. Home promo banner slider

### Data

New `src/data/promos.ts`:

- `id`, `title`, `subtitle`, `ctaLabel`, `ctaHref`, `image` (or background treatment)

3–4 branded placeholder slides.

### Behavior

- Autoplay on by default (interval ~5s).
- Play / Pause toggle.
- Drag / swipe left–right (pointer + touch); prev/next + dots.
- Pause autoplay during drag; resume afterward only if play is enabled.
- Accessible carousel labeling (`aria-roledescription`, control labels).

### Placement

Home page below hero (near / after PromoMarquee — exact order: hero → promo slider → existing marquee or marquee → slider; prefer **hero → promo slider → marquee** so the visual banner is primary).

### Files

- `src/data/promos.ts`
- `src/app/components/PromoBannerSlider.tsx` (+ CSS)
- Wire into `src/app/page.tsx`

### Non-goals

- Admin CMS for banners
- Video banners in v1

---

## Error handling & edge cases

| Case | Handling |
| --- | --- |
| Empty search query | Hide results dropdown |
| Product without video | Gallery images-only (current behavior) |
| Video fails to load | Show poster/fallback to first image if available |
| Single promo slide | Hide drag/controls noise; still show slide |
| Reduced motion | Disable autoplay animation / star stagger; still interactive |

## Testing checklist

- Navbar search filters live and navigates to product detail
- Mobile drawer search works
- Product detail opens on video slide; images follow; controls work
- Chatbot price/contact answers have no Messenger CTA; fallback is positive
- Feedback stars animate once into view
- Promo slider autoplays, pauses, resumes, and drags on desktop + touch

## Out of scope (later)

- Admin UI for promos/reviews
- Visitor review submissions with photo upload
- Real per-product video assets beyond the shared sample URL
