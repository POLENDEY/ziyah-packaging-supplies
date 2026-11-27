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

