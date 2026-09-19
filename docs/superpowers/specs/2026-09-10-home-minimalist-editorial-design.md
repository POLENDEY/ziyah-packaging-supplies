# Home Minimalist Editorial Redesign

**Date:** 2026-09-10  
**Status:** Approved for planning  
**Approach:** Editorial minimal — quieter structure, expressive brand color, keep Ziyah branding prominent

## Goal

Transform the crowded homepage into a professional, minimalist editorial layout with intentional modern motion — without looking sterile. Brand identity (wordmark, palette, product atmosphere) stays strong; clutter and competing UI chrome go away.

## Decisions locked

| Topic | Choice |
| --- | --- |
| Scope intensity | **B — Editorial minimal** |
| Promo banner slider | Unmount from home (keep component/data) |
| Promo marquee | Unmount from home (keep component) |
| Branding | Keep Ziyah wordmark as hero brand signal; nav logo unchanged |
| Color | Expressive brand color (not flat/boring); stay within existing palette |
| Hero CTA | One primary button (Shop Products); Get a Quote as text link |
| Location pill | Remove from hero |
| Categories | Link grid without icon cards / heavy borders |
| Why / Feedback / CTA / Info | Keep, quieter chrome, more whitespace |
| New dependencies | None |
| Other pages | Out of scope (home only) |

## Architecture overview

```
Home (page.tsx + page.module.css)
  ├─ Hero (BrandWordmark + H1 + short line + primary CTA + text link)
  │    └─ HeroFulfillmentScene (quieter scrim; no plus-grid overlay)
  ├─ Categories (flat link grid)
  ├─ Why Ziyah (simple 2×2 points)
  ├─ FeedbackSection (lighter chrome; existing data)
  ├─ CTA strip
  └─ Info strip (address / phone / email / hours)

Not mounted on home:
  PromoBannerSlider, PromoMarquee
```

Shared tokens remain in `globals.css`. No site-wide rebrand.

---

## 1. Hero (first viewport)

### Content budget

- Brand wordmark (`BrandWordmark` onDark, large) — hero-level brand signal
- One headline: “Buy Food Packaging”
- One supporting sentence covering nationwide PH / Pasay store (merge former badge + long desc into one short line)
- Primary CTA: Shop Products
- Secondary: Get a Quote as a text/link style (not a second full-width outline button)

### Remove from hero

- Location pill (“Pasay City · Nationwide PH”)
- Dual-tone multi-line headline span treatment that fights the brand
- Plus-sign SVG grid overlay
- Heavy multi-stop “rainbow” hero gradient that reads noisy next to the scene

### Visual

- Keep `HeroFulfillmentScene` as full-bleed atmospheric plane
- Quieter dark brand wash / left scrim so type stays readable
- Soft brand glow accents (primary / accent) — present, not busy
- Transparent-to-solid nav behavior only if it stays simple; default: keep current light nav if change risks complexity

### Motion

- Staggered fade + slight rise on brand → title → copy → actions (2–3 beats)
- Honor `prefers-reduced-motion`

---

## 2. Color (expressive, on-brand, not boring)

Stay inside existing CSS variables (`--primary-dark`, `--primary`, `--primary-light`, `--accent`, `--primary-xlight`, grays). Avoid purple-on-white / cream-serif / broadsheet tropes called out in project design rules.

### Principles

- **Brand first:** Maroon / plum / warm coral accents remain visible in hero wash, primary buttons, and selective section moments
- **Not sterile:** Use soft brand washes, a warm near-white body, and one richer mid-page accent moment (e.g. CTA band in brand gradient) so the page does not read as flat white
- **Not crowded:** One dominant color idea per section; no competing patterns, pills, or chrome stacks
- **Contrast:** Body text on light surfaces; hero text on dark brand wash with enough scrim for WCAG readability

### Application map

| Surface | Treatment |
| --- | --- |
| Hero | Dark brand wash over scene + soft accent glow; no grid texture |
| Body sections | Warm off-white / white with generous space |
| Category hover | Accent underline or text color shift |
| Why section | Optional very light brand wash (`--primary-xlight`) without card boxes |
| Feedback | Clean on white; stars keep brand accent |
| CTA band | Brand gradient or solid primary — the intentional “color beat” |
| Info strip | Quiet; muted text, minimal icon tint |

---

## 3. Mid-page sections

### Categories

- Left- or center-aligned header: short title + one sentence
- Grid of links: name, one-line desc, subtle “Shop →”
- No icon boxes, card shadows, gradient card fills, or heavy borders
- Hover: subtle translate or underline grow only
- Same five category routes / copy as today (can lightly shorten desc if needed)

### Why Ziyah

- Four points, 2×2 desktop / stack mobile
- Title + short desc; small accent mark or number — not icon-in-box cards
- Quiet background (white or soft `--primary-xlight`)

### Feedback

- Keep `FeedbackSection` + curated reviews
- Reduce card chrome / borders / shadows where present
- Keep star fill animation; softer entrance
- Honor reduced motion

### CTA + info

- One calm CTA band with brand color presence: Ready to stock up? + Shop / Contact
- Info strip: address, phone, email, hours — text-first, light icons, no boxed tiles

---

## 4. Typography & motion

### Type

- Existing Geist sans stack
- Hero: one strong headline; brand wordmark carries identity (no second competing display style in the fold beyond the wordmark)
- Section H2s: slightly less aggressive weight/size than current ultra-bold marketing look
- Body ~16–17px, generous line-height; shorten long marketing paragraphs where they clutter

### Motion (intentional, not noisy)

1. Hero stagger entrance
2. Section scroll reveal (fade/rise once via existing `HomeScrollEffects` / `data-reveal`)
3. Category hover micro-interaction

No new animation libraries.

---

## 5. Files & non-goals

### Likely touch

- `src/app/page.tsx` — structure, unmount promos, hero content budget
- `src/app/page.module.css` — layout, color, type, hero, sections, buttons
- `src/app/components/FeedbackSection.module.css` — quieter chrome (as needed)
- Possibly light hero scene CSS if scrim/overlay lives there

### Non-goals

- Redesign About / Products / Contact / Quote pages
- Delete PromoBannerSlider / PromoMarquee / promo data (only unmount from home)
- New fonts, new color system outside brand tokens
- Admin / CMS changes
- Navbar/footer full redesign (minor contrast tweaks only if required for hero)

---

## Error handling & edge cases

| Case | Handling |
| --- | --- |
| Reduced motion | Disable stagger / reveal motion; layout remains complete |
| Missing scene assets | Hero still readable via solid brand wash fallback |
| Long category names | Wrap cleanly; no truncation that hides product identity |
| Mobile | Single-column stacks; primary CTA full-width OK; secondary stays text link |

## Testing checklist

- [ ] First viewport reads as one composition: brand + headline + one line + CTA group
- [ ] No promo slider or marquee on home
- [ ] Brand wordmark visible and dominant in hero; nav brand still present
- [ ] Color feels on-brand and not flat/sterile; CTA/hero carry brand heat
- [ ] Categories / Why / Feedback / CTA / Info present and quieter
- [ ] Motions work; `prefers-reduced-motion` respected
- [ ] Mobile + desktop layout intact; links still route correctly
- [ ] SEO metadata / JSON-LD unchanged in intent

## Out of scope (later)

- Reintroducing promos in a calmer single-slot treatment
- Site-wide minimalist pass on inner pages
- Transparent glass nav experiments beyond a simple tweak
