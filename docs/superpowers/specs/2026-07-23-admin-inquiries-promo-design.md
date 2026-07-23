# Admin Inquiries Reply, Pagination, Export & Promo Slider UX

**Date:** 2026-07-23  
**Status:** Approved for implementation

## Decisions

| Topic | Choice |
| --- | --- |
| Reply | CMS email via existing SMTP; mark inquiry `replied` |
| Export | CSV |
| Pagination | 10 rows per page |
| Promo slider | Full width; no Pause/Play button; click slide toggles play/pause with indicator |

## Admin reply

- Reply form in `InquiryLightbox` (textarea + Send).
- `POST /api/inquiry/reply` with `{ id, message }` sends email to inquirer email via nodemailer.
- On success: set inquiry status to `replied`, show success in UI.
- Store optional `admin_reply` / `replied_at` only if easy; otherwise status update is enough for v1.

## Pagination & export

- Client-side pagination: 10 inquiries per page; prev/next + “Page X of Y”.
- Export CSV of all currently loaded inquiries (columns: id, date, name, email, phone, subject, message, status, is_read).

## Promo slider

- Full-bleed width (100vw / edge-to-edge), remove max-width shell constraint for the banner.
- Remove visible Pause/Play button.
- Click on slide (not on CTA link) toggles `playing`.
- Small indicator badge shows Playing / Paused.
- Drag still pauses during interaction; autoplay resumes after if playing.

## Out of scope

- Full reply thread history UI
- Excel export
- Server-side pagination
