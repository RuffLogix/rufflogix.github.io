# 05 — Homepage: metadata block and section reorder

Type: prototype
Status: open
Blocked by: 01, 02, 03

## Question

Rebuild the homepage so it agrees with the new IA: a Gwern-style metadata block
under the name, then Research, then Work, then Writing — and the philosophy
section cut.

Current order in `src/pages/index.astro` is `hero → about strip → Selected Work
→ Selected Research → philosophy → Writing`, which now contradicts a nav that
leads with Publications.

Decisions this ticket must land:

- **What goes in the metadata block.** Candidates: role and affiliation,
  research areas, location, links (Scholar / ORCID / GitHub), last-updated
  date, publication count. It has to be dense enough to read as apparatus and
  short enough not to become a second hero. Prototype two densities and pick.
- **What "last updated" means** if it appears — build date, last content
  change, or a hand-maintained value. A stale date is worse than none.
- **Whether the about strip and focus-areas block survive** or are subsumed by
  the metadata block. Keeping both is probably redundancy.
- **Section order and how many entries each section previews.** With 3
  publications, "Selected Research" showing all three is the whole record —
  decide whether that reads as confident or as thin.
- **What replaces the philosophy section's vertical space**, if anything. The
  answer may be nothing; the page is allowed to get shorter.

Note the ratio constraint from the map: leading with research must not make the
site look thin, and the engineering work is the larger body of evidence.

## Comments
