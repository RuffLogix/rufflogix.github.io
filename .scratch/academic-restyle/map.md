# Map: Academic Restyle

Labels: `wayfinder:map`

## Destination

`rufflogix.github.io` changed in place so it reads as an academic researcher's
site without losing the developer / AI-engineer register — and so that colour
carries one legible meaning instead of five. Reaching the end means the site is
shipped in its new form, not that a spec exists.

## Notes

**Domain**: a personal Astro 5 site (`src/pages/*/index.astro`, `src/styles/formal.css`,
`src/utils/hue.ts`). Content lives in `src/constants/*.constant.ts` — 3 publications,
**16 live projects** (six more are commented out), 19 events. That ratio is the
governing constraint: this is an engineer with a real research record, not a professor,
and the design must not pretend otherwise.

**Execution is in scope.** This map overrides Wayfinder's plan-only default: tickets
carry implementation, because every decision here is only testable by looking at the
rendered page. A ticket is resolved when the change is in the working tree and the
page has been looked at.

**Skills each session should consult**: `frontend-design`, `prototype`,
`grilling`, `domain-modeling`.

**Design anchors** (agreed in charting, each for one thing only):

- **Distill.pub** — the typographic contract: wide measure, figures first-class, one accent, nothing decorative.
- **Gwern.net** — the metadata apparatus: dense header block of facts up front. Steal the apparatus, not the maximalism.
- **Lilian Weng (lilianweng.github.io)** — the register: engineer-researcher, near-mono palette, competent rather than decorated.

Synthesis to aim for: **paper-grade typography, engineer's metadata density, one ink plus two hues.**

### Settled in charting

These were decided before any ticket existed. They constrain every ticket; they are
not open for re-litigation inside a ticket without saying so explicitly.

1. **"Academic" means surface *and* substance, weighted to substance.** Findable
   metadata first; the typographic surface then makes it feel native rather than
   costumed.
2. **Colour drops from five hues to two, on a research/engineering axis.**
3. **The axis applies only where it is real; absence of hue is meaningful.**
   Publications, projects and the org timeline carry a hue. Events, skills and
   tags stay mono. Where an item is genuinely both, artifact type decides — a DOI
   makes it research.
4. **Hue values**: research = amber `#D9A05B` (paper, archive, citation),
   engineering = slate-blue `#7FA8D9` (machine, code, runtime). `--accent` must
   retreat to near-ink, otherwise "neutral" and "engineering" become the same
   colour and rule 3 collapses.
5. **Type stack**: Source Serif 4 for headings, IBM Plex Sans for body,
   JetBrains Mono for labels. Plus Jakarta Sans is retired — it reads as
   startup-landing-page and fights a serif heading rather than receding under it.
6. **Serif is for headings only.** Full serif body copy on a site with 22
   engineering projects tips from academic into costume.
7. **Dark stays the default theme.** Light must still be tuned, not merely present.
8. **IA becomes `Publications · Work · Writing · About`.** Events are absorbed
   into About as awards/competitions. A standalone Events tab is the site's
   strongest student-portfolio signal.
9. **Substance affordances that ship**: per-entry BibTeX copy, abstract
   expand/collapse, DOI + PDF links, full author lists with self emphasised,
   numbered reverse-chron entries, a CV page with PDF export, ORCID /
   Semantic Scholar links. **The CV half is under challenge** — see ticket 08.
10. **The homepage philosophy section is cut**, replaced by a Gwern-style
    metadata block under the name. Showing beats declaring.

## Decisions so far

<!-- one line per resolved ticket: gist, then link to the ticket holding the detail -->

- [01 — Two-hue token migration](issues/01-two-hue-token-migration.md): five hues
  collapsed to research/engineering; `--accent` is ink, the ambient glows and the
  per-section navigation hue are gone, and events, skills and tags now render unhued
  on purpose. Also establishes that only **16** of the 22 projects are live.
- [07 — CV page and PDF export approach](issues/07-cv-page-and-pdf-export.md): if a CV
  ships, it is a print stylesheet plus a hand-maintained static PDF — never
  jspdf/html2canvas, which already throws at 390px on this site's `color-mix()` usage
  and would ship ~82× the site's current JavaScript to produce an unsearchable image.
  Surfaced that most researcher homepages link no CV at all, which is now ticket 08.

## Not yet specified

- **The Projects page under an academic frame.** 16 entries is the largest
  collection on the site and the least paper-like. Unclear yet whether it wants
  grouping by research area, a density change, or simply to inherit whatever the
  Publications page establishes. Revisit once Publications has landed.
- **The six commented-out projects** in `src/constants/project.constant.ts`. Whether
  they get restored, deleted, or stay dormant is a content-weight question that only
  makes sense once the Projects page's new frame exists.
- **The Writing / Articles page.** Current state unexamined and probably thin.
  Whether it survives as a nav item at all depends on what is actually in it.
- **Light-mode retune.** The existing light tokens were tuned against a five-hue
  palette. Once the two-hue dark palette is settled, light needs re-deriving
  rather than patching.
- **Per-publication detail routes.** Three papers may or may not warrant their own
  pages. Depends on how much the redesigned Publications page can carry inline.
- **Scholar-indexable metadata.** Highwire Press / Dublin Core `<meta>` tags, and
  whether they belong on a listing page or require detail routes. Blocked on the
  detail-routes question above.
- **Favicon, OG image and social preview** consistency with the new register.

## Out of scope

- **Citation counts on publications** — needs a build-time call to an external API,
  and with three papers the numbers would hurt more than help. Ruled out during charting.
- **Rewriting the publication / project prose itself.** This effort changes how
  content is presented, not what it says.
- **Any CMS or blog-engine migration.** Content stays in `src/constants/*.constant.ts`.
