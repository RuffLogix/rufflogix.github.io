# 01 — Two-hue token migration

Type: task
Status: resolved
Blocked by: —

## Question

Collapse the five-hue categorical system to the two-hue research/engineering axis,
in the token layer and every consumer, so that later tickets have a settled palette
to design against.

Concretely, this ticket is done when:

- `src/utils/hue.ts` exposes two hues (`research`, `engineering`) instead of the
  five Agoda-derived colour names, and the five lookup tables (`projectHue`,
  `publicationHue`, `eventHue`, `orgHue`, `skillHue`) are re-based onto that axis
  or deleted where the axis does not apply.
- `src/styles/formal.css` carries `--hue-research: #D9A05B` and
  `--hue-engineering: #7FA8D9` in both themes, clearing roughly 7:1 on `--bg`
  in dark and 4.5:1 in light.
- `--accent` is demoted to near-ink so that neutral and engineering are not the
  same colour. Everything currently leaning on `--accent` as a *colour* (focus
  ring, `::selection`, `--accent-dim`, `--accent-glow`, the hero glows) is
  re-decided rather than left to drift.
- The 14 `data-hue` call sites are updated. Per map rule 3, events, skills and
  tags lose their hue entirely and become mono; publications, projects and the
  About org timeline keep one.
- `SECTION_HUE` / `sectionHue` are re-decided: with two hues, a per-section
  wayfinding colour may no longer earn its place. If it goes, the navbar
  underline and logo dot need a replacement treatment.

Open sub-decisions the resolving session owns: whether `orgHue` survives as a
lookup or becomes a field on the timeline data; what neutral `--accent` actually
becomes; and whether the ambient hero glows survive at all.

## Answer

Done. `pnpm build` and `pnpm astro check` both clean (0 errors, 0 warnings, 0 hints
across 27 files), and every page was looked at in both themes.

### What the axis became

`src/utils/hue.ts` now exports two hues and two lookups, nothing else:

- `projectHue(category)` — `"AI / Machine Learning"` and `"Data Science"` resolve to
  research; everything else to engineering.
- `orgHue(instituteName)` — returns `Hue | undefined`. Chulalongkorn University and
  AIMET are research; Agoda, KBTG, LINE MAN Wongnai, Looloo Technology and Khui AI are
  engineering; Benjamarachutit School is deliberately absent and renders in ink.

`publicationHue` is gone — every publication is research by definition, so the call
sites set `data-hue="research"` literally rather than routing a constant through a
lookup. `eventHue`, `skillHue`, `SECTION_HUE` and `sectionHue` are deleted outright.

### Sub-decisions this ticket owned

**`--accent` became ink**: `#E6E9EC` dark, `#1A1D21` light, with `--accent-dim` recast
as a neutral rgba. `--accent-glow` was unused and is deleted. Because the `--hue`
fallback is `var(--accent)`, an unhued subtree now renders in ink automatically, which
is what makes absence of hue readable rather than accidental.

**The ambient glows are gone.** Three blurred radial gradients in blue, purple and
green were the single most decorative element on the site and the most literal form of
the multi-colour problem. `--glow-1/2/3`, `.hero-ambient`, `.glow`, the `drift`
keyframes and `.nf-ambient` / `.nf-glow` on the 404 are all removed.

**Per-section navigation hue is gone.** With two hues left, tinting the navbar by
section spent the axis on chrome rather than on work. `.nav-link::after` is now
`var(--text-1)` and `.nav-logo-dot` is `var(--text-3)`.

**Consumers that lost their hue got explicit ink rather than silent fallback.** On the
Events page `.event-type` is `--text-2`, the year hover is `--text-1`, the role badge
is ink-on-`--surface-hover`, and the title hover became an underline instead of a
colour change — there was no colour left to change to. On About, `.skill-cat` is
`--text-2`. A stray hardcoded `rgba(74, 222, 128, …)` green in the `pulse-dot`
keyframe was also removed; it had survived the previous hue pass unnoticed.

**Publications lost its venue colour key.** With every entry research-hued, a legend
keyed on colour would have had one value. The Venue group is now text-only, matching
the Areas group. Ticket 04 re-decides the block in full. Publication title and arrow
hovers moved from `--accent` to `--hue`, so they are amber rather than ink.

**Articles**: `.medium-link` was `var(--accent)` and would have become an unmarked ink
link, so it gained an underline.

### What it looks like

Colour is now rare enough to read. The Projects index shows 5 amber rows against 11
slate ones, so the hue tells you which work was research before you read the title.
The Publications page is uniformly amber. The Events page is entirely mono, which
alone makes it read less like a student portfolio. Light mode holds up without retuning
— that remains fog, not a defect.

### Facts for later tickets

- **Only 16 of the 22 projects are live.** Six entries (Full Stack, IoT Project, Data
  Science, Mobile App, Developer Tool, and one Web Development) are commented out in
  `src/constants/project.constant.ts` lines 250–330. The live split is 8 Web
  Development, 5 AI / Machine Learning, 2 Game Development, 1 AI / Chatbot. The map's
  ratio constraint is therefore 3 publications : 16 projects : 19 events. `projectHue`
  still maps the commented categories, so restoring any of them needs no code change.
- **Ticket 04's affordance list is largely already built.** The Publications page
  already renders numbered entries, full author lists with self bolded, DOI, PDF, a
  per-entry BibTeX disclosure and an area tag. 04 is closer to a redesign of an
  existing page than a build from scratch — check before rebuilding.
- **The Events page emoji are now the only remaining colour on that page.** Each row
  leads with 🏆 / 🥈 / 🛠️ / 💻. Against an otherwise mono list they are conspicuous.
  Ticket 06 should decide whether they survive absorption into About.

## Comments
