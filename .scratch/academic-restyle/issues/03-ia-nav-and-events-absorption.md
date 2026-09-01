# 03 — IA: nav reorder and Events absorption

Type: task
Status: open
Blocked by: —

## Question

Restructure the site's information architecture to `Publications · Work ·
Writing · About`, and decide what happens to the `/events` route and its 19
entries.

Done when:

- `src/components/FormalNavbar.astro` reflects the new order, with Publications
  first. Note that the nav currently also carries `data-hue` per link via
  `SECTION_HUE`, which ticket 01 may remove — coordinate rather than duplicate.
- `/events` no longer appears in navigation. Decide its fate explicitly: keep
  the route as a deep link, redirect it to the About page anchor, or delete it.
  This is a public URL on a personal site, so a silent 404 is the one outcome
  to avoid.
- The 19 entries from `src/constants/event.constant.ts` are reachable from the
  About page. *How* they present there is ticket 06's question, not this one —
  this ticket only guarantees they are not orphaned.
- Any in-page links to `/events` elsewhere in `src/pages/` are updated.

The presentational question ("how do 19 competition entries sit inside About
without setting its centre of gravity") belongs to ticket 06.

Whether a CV link joins the nav is ticket 08's call, not this one — but if 08 resolves
first, honour it here rather than shipping a nav that has to change again.

## Comments
