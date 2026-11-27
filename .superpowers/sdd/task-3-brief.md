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

