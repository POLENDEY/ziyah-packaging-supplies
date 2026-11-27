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

