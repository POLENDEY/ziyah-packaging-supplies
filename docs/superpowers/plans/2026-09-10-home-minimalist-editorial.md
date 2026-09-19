# Home Minimalist Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Ziyah homepage into an editorial-minimal layout: quiet structure, strong brand wordmark, expressive on-brand color, and intentional motion — without promo slider/marquee clutter.

**Architecture:** Home-only changes in `page.tsx` + `page.module.css`, with light Feedback CSS polish. Keep `HeroFulfillmentScene`, `BrandWordmark`, `HomeScrollEffects`, and `FeedbackSection`. Unmount promo components from home without deleting them.

**Tech Stack:** Next.js App Router, React Server Components + existing client islands, CSS modules, existing CSS variables in `globals.css`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-10-home-minimalist-editorial-design.md`
- Approach: Editorial minimal (B)
- Keep Ziyah branding (hero wordmark + brand palette)
- Color must stay expressive / not sterile — use brand washes + CTA color beat
- Unmount `PromoBannerSlider` and `PromoMarquee` from home only (do not delete files)
- Hero: one primary CTA (Shop Products); Get a Quote as text link; no location pill
- No new dependencies / fonts / site-wide rebrand
- Honor `prefers-reduced-motion`
- Do not run production builds unless the user asks; verify with lint / structure checks / dev server
- Do not commit unless the user asks

## File map

| File | Responsibility |
| --- | --- |
| `src/app/page.tsx` | Hero content budget; unmount promos; simplify category/why markup |
| `src/app/page.module.css` | Hero wash, type, category links, why points, CTA, info, motion |
| `src/app/components/FeedbackSection.module.css` | Quieter review chrome |
| `src/app/components/PromoBannerSlider.tsx` | Unchanged (unmounted) |
| `src/app/components/PromoMarquee.tsx` | Unchanged (unmounted) |
| `src/app/components/HeroFulfillmentScene.tsx` | Unchanged |
| `src/app/components/BrandWordmark.tsx` | Unchanged (still used in hero) |
| `src/app/components/HomeScrollEffects.tsx` | Unchanged |

---

### Task 1: Slim homepage structure (markup)

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: existing `categories`, `whyUs`, `BrandWordmark`, `HeroFulfillmentScene`, `FeedbackSection`, `HomeScrollEffects`, `SITE`
- Produces: home without promo mounts; hero without badge / dual-tone span / outline button class; categories without icon boxes; why without circular icon boxes

- [ ] **Step 1: Confirm current crowded mounts**

Run from repo root:

```bash
rg -n "PromoBannerSlider|PromoMarquee|heroBadge|heroBrand|categoryIcon|whyIcon" src/app/page.tsx
```

Expected: matches for promo imports/usage, `heroBadge`, `heroBrand`, `categoryIcon`, `whyIcon`.

- [ ] **Step 2: Update imports in `page.tsx`**

Remove:

```tsx
import PromoMarquee from "./components/PromoMarquee";
import PromoBannerSlider from "./components/PromoBannerSlider";
```

Remove unused icon imports that only served category/why boxes if no longer referenced: `IconBento`, `IconPackage`, `IconSushi`, `IconTray`, `IconCheck`, `IconList`, `IconFactory`, `IconTruck` (and drop `Icon` fields from `categories` / `whyUs` data). Keep `IconArrowRight`, `IconMapPin`, `IconPhone`, `IconMail`, `IconClock` for remaining UI.

Replace `categories` with plain objects (no `Icon`):

```tsx
const categories = [
  {
    name: "Hard Bento Clear",
    desc: "Clear hard bento boxes with lids — 2 to 5 divisions, 1000ml.",
    href: "/products/hard-bento-clear",
  },
  {
    name: "Bento Boxes",
    desc: "Red outside, black inside bento boxes with clear lids for everyday takeout.",
    href: "/products/bento-boxes",
  },
  {
    name: "Hard Bento Black",
    desc: "Black hard bento boxes with lids — premium meal presentation.",
    href: "/products/hard-bento-black",
  },
  {
    name: "Round Sushi Trays",
    desc: "Round black sushi trays with gold pattern and lids — multiple sizes.",
    href: "/products/round-sushi-trays",
  },
  {
    name: "Rectangular Sushi Trays",
    desc: "RE-ST series rectangular sushi trays with lids for plated sets.",
    href: "/products/rectangular-sushi-trays",
  },
];
```

Replace `whyUs` with:

```tsx
const whyUs = [
  {
    title: "Food-Grade Quality",
    desc: "Packaging chosen for safe food contact — so your brand ships with confidence.",
  },
  {
    title: "Wide Product Range",
    desc: "From disposable trays to reusable containers — stock what your menu needs.",
  },
  {
    title: "Bulk & Retail Orders",
    desc: "Flexible ordering for small kitchens, home businesses, and high-volume operations.",
  },
  {
    title: "Nationwide Delivery",
    desc: "We serve food businesses across the Philippines — not just Metro Manila.",
  },
];
```

- [ ] **Step 3: Replace hero JSX**

Inside the hero section, replace `heroContent` children with:

```tsx
<div className={styles.heroContent} data-reveal>
  <div className={styles.heroBrand}>
    <BrandWordmark variant="onDark" size="lg" />
  </div>
  <h1 className={styles.heroTitle}>Buy Food Packaging</h1>
  <p className={styles.heroDesc}>
    Food-grade bento boxes, sushi trays, and wholesale takeout packaging —
    from our Pasay City store to kitchens nationwide across the Philippines.
  </p>
  <div className={styles.heroActions}>
    <Link href="/products" className={styles.btnPrimary}>
      Shop Products
    </Link>
    <Link href="/quote" className={styles.btnText}>
      Get a Quote
    </Link>
  </div>
</div>
```

Keep `heroScene`, `heroScrim`, `heroOverlay` wrappers for now (overlay styles change in Task 2).

- [ ] **Step 4: Remove promo mounts; simplify category + why markup**

Delete the `PromoBannerSlider` and `PromoMarquee` wrappers entirely.

Category map — no icon wrapper:

```tsx
<div className={styles.categoryGrid}>
  {categories.map((cat) => (
    <Link key={cat.name} href={cat.href} className={styles.categoryCard}>
      <h3>{cat.name}</h3>
      <p>{cat.desc}</p>
      <span className={styles.categoryArrow}>
        Shop <IconArrowRight size={14} />
      </span>
    </Link>
  ))}
</div>
```

Why map — numbered accent, no icon box:

```tsx
<div className={styles.whyGrid}>
  {whyUs.map((item, index) => (
    <div key={item.title} className={styles.whyCard}>
      <span className={styles.whyIndex} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
    </div>
  ))}
</div>
```

Keep Feedback, CTA, info strip, JSON-LD, and `HomeScrollEffects` as-is structurally. Optionally shorten section header copy to one sentence each if still long.

- [ ] **Step 5: Structure verify**

```bash
rg -n "PromoBannerSlider|PromoMarquee|heroBadge|categoryIcon|whyIcon" src/app/page.tsx
```

Expected: no matches.

```bash
rg -n "BrandWordmark|btnText|whyIndex|FeedbackSection" src/app/page.tsx
```

Expected: matches present.

- [ ] **Step 6: Commit (only if user asked)**

```bash
git add src/app/page.tsx
git commit -m "refactor(home): slim hero and drop promo mounts for editorial layout"
```

Skip if user has not requested commits.

---

### Task 2: Hero visual — quiet scene, expressive brand color

**Files:**
- Modify: `src/app/page.module.css` (hero + buttons + reduced-motion blocks)

**Interfaces:**
- Consumes: classes `hero`, `heroScene`, `heroScrim`, `heroOverlay`, `heroInner`, `heroContent`, `heroBrand`, `heroTitle`, `heroDesc`, `heroActions`, `btnPrimary`, new `btnText`
- Produces: quieter hero without plus-grid; brand wash + soft accent glow; text-link secondary CTA

- [ ] **Step 1: Replace hero background / overlay styles**

Update `.hero` to a quieter brand wash (keep heat, reduce rainbow noise):

```css
.hero {
  position: relative;
  min-height: clamp(520px, 82vh, 760px);
  display: flex;
  align-items: center;
  background:
    radial-gradient(ellipse 70% 50% at 85% 35%, rgba(237, 158, 89, 0.28), transparent 55%),
    radial-gradient(ellipse 50% 45% at 10% 80%, rgba(163, 64, 84, 0.35), transparent 60%),
    linear-gradient(160deg, #1b1931 0%, #2f1f34 38%, #662249 100%);
  overflow: hidden;
  padding: 96px 0 72px;
}
```

Make `.heroOverlay` a soft vignette instead of the plus-grid SVG (empty decorative noise):

```css
.heroOverlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 90% 70% at 50% 100%, rgba(27, 25, 49, 0.35), transparent 55%),
    linear-gradient(180deg, rgba(27, 25, 49, 0.12) 0%, transparent 40%);
}
```

Keep `.heroScrim` readable; slightly soften if needed so product scene still peeks through on desktop.

- [ ] **Step 2: Simplify hero type + actions**

```css
.heroTitle {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  color: #fff;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
  animation: heroRise 0.7s ease both 0.1s;
}

/* remove .heroTitle span rules if present */

.heroDesc {
  font-size: clamp(15px, 1.6vw, 18px);
  color: rgba(255, 255, 255, 0.88);
  max-width: 440px;
  line-height: 1.6;
  margin-bottom: 28px;
  animation: heroRise 0.7s ease both 0.16s;
}

.heroActions {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  animation: heroRise 0.7s ease both 0.22s;
}

.btnText {
  display: inline-flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  padding-bottom: 2px;
  transition: color var(--transition), border-color var(--transition);
}

.btnText:hover {
  color: #fff;
  border-color: #fff;
}
```

Delete unused `.heroBadge` / `.heroSteps` rules (or leave harmless dead CSS — prefer delete).

Keep `heroRise` + reduced-motion: include `.btnText` parent `.heroActions` already covered; ensure removed classes are dropped from the reduce list.

- [ ] **Step 3: Visual verify (dev)**

```bash
npm run dev
```

Open `/` — check: brand wordmark present; no location pill; one solid CTA + text link; no plus-grid; scene still visible; colors warm/on-brand not flat.

- [ ] **Step 4: Commit (only if user asked)**

```bash
git add src/app/page.module.css
git commit -m "style(home): quiet hero wash with expressive brand color"
```

---

### Task 3: Editorial mid-page sections (categories, why, CTA, info)

**Files:**
- Modify: `src/app/page.module.css`
- Modify: `src/app/page.tsx` (only if section headers need shorter copy)

**Interfaces:**
- Consumes: `categoryCard`, `whyCard`, `whyIndex`, `section`, `sectionAlt`, `ctaBanner`, `infoStrip`
- Produces: flat category links; numbered why points; calmer info strip; brand-hot CTA band retained

- [ ] **Step 1: Restyle categories to flat links**

Replace category card chrome:

```css
.sectionHeader {
  text-align: left;
  margin-bottom: 40px;
  max-width: 560px;
}

.sectionHeader h2 {
  font-size: clamp(24px, 3.5vw, 34px);
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 10px;
  letter-spacing: -0.03em;
}

.sectionHeader p {
  font-size: 16px;
  color: var(--gray-600);
  max-width: 520px;
  margin: 0;
  line-height: 1.6;
}

.categoryGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid rgba(27, 25, 49, 0.1);
}

.categoryCard {
  display: flex;
  flex-direction: column;
  padding: 28px 8px 28px 0;
  margin-right: 32px;
  text-decoration: none;
  color: inherit;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(27, 25, 49, 0.1);
  border-radius: 0;
  box-shadow: none;
  transition: transform 0.25s ease;
}

.categoryCard::before {
  display: none;
}

.categoryCard:hover {
  transform: translateX(4px);
  box-shadow: none;
  border-color: rgba(27, 25, 49, 0.1);
}

.categoryCard h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 8px;
}

.categoryCard p {
  font-size: 14px;
  color: var(--gray-600);
  line-height: 1.6;
  flex: 1;
}

.categoryArrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  transition: gap 0.2s ease;
}

.categoryCard:hover .categoryArrow {
  gap: 10px;
}
```

Remove `.categoryIcon` rules.

- [ ] **Step 2: Restyle why + section alt + info**

```css
.sectionAlt {
  background: var(--primary-xlight);
}

.whyGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 36px 48px;
}

.whyCard {
  background: transparent;
  border: none;
  border-top: none;
  padding: 0;
  box-shadow: none;
}

.whyIndex {
  display: block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent);
  margin-bottom: 10px;
}

.whyCard h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 8px;
}

.whyCard p {
  font-size: 14px;
  color: var(--gray-600);
  line-height: 1.65;
  max-width: 360px;
}

/* remove .whyIcon rules */

.infoStrip {
  background: #fff;
  padding: 48px 0;
  border-top: 1px solid var(--gray-100);
}

.infoIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 0;
  background: transparent;
  color: var(--accent);
  padding: 0;
}
```

Keep `.ctaBanner` brand gradient (this is the intentional color beat). Optionally soften radius on CTA buttons already defined.

Update responsive breakpoints: at `768px`, categories 1 column; why 1 column; `.heroActions` can stay row with wrap (text link next to button) — avoid forcing both full-width unless primary needs it:

```css
@media (max-width: 540px) {
  .heroActions {
    flex-direction: column;
    align-items: flex-start;
  }

  .btnPrimary {
    text-align: center;
    width: 100%;
  }
}
```

- [ ] **Step 3: Shorten section headers in `page.tsx` if still verbose**

Example targets:

- Categories H2: `Shop by Category`
- Categories P: `Bento boxes and sushi trays for takeout, meal prep, and wholesale.`
- Why H2: `Why food businesses choose Ziyah`
- Why P: `Food-grade packaging, flexible orders, and delivery across the Philippines.`

- [ ] **Step 4: Verify**

```bash
npm run lint
```

Expected: no new errors from home files.

Manual: `/` categories look like editorial list (no icon cards); why uses `01`–`04`; CTA still brand-colored; info icons unboxed.

- [ ] **Step 5: Commit (only if user asked)**

```bash
git add src/app/page.tsx src/app/page.module.css
git commit -m "style(home): editorial categories, why points, and quieter info strip"
```

---

### Task 4: Quieter feedback section

**Files:**
- Modify: `src/app/components/FeedbackSection.module.css`

**Interfaces:**
- Consumes: existing `FeedbackSection.tsx` class names (`.section`, `.card`, `.photo`, `.stars`, etc.)
- Produces: less chrome, more whitespace; motion preserved

- [ ] **Step 1: Soften card chrome**

```css
.section {
  padding: 80px 0;
  background: #fff;
}

.header h2 {
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 10px;
}

.card {
  background: transparent;
  border: none;
  border-top: 1px solid rgba(27, 25, 49, 0.1);
  border-radius: 0;
  padding: 24px 0;
  box-shadow: none;
  opacity: 0;
  transform: translateY(14px);
}

.photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 40px;
}
```

Keep star / entrance animations and reduced-motion rules intact.

- [ ] **Step 2: Verify feedback on `/`**

Confirm reviews still appear, stars animate once into view, no heavy white cards on gradient.

- [ ] **Step 3: Commit (only if user asked)**

```bash
git add src/app/components/FeedbackSection.module.css
git commit -m "style(home): quiet customer feedback chrome"
```

---

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
