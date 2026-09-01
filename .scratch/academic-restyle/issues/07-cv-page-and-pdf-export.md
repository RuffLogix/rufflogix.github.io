# 07 — CV page and PDF export approach

Type: research
Status: resolved
Blocked by: —

## Question

How should the CV page produce a downloadable PDF, given this is a static Astro
site deployed to GitHub Pages?

`jspdf` and `html2canvas` are already in `package.json` (with `@types/jspdf` in
devDependencies), which suggests someone previously intended this, but nothing
in `src/` imports them — so the approach was never landed and is not a
constraint.

Establish the facts for three candidate approaches and recommend one:

1. **`jspdf` + `html2canvas` client-side.** Rasterises the DOM. Find out
   whether the output has selectable text (it does not, when going through
   `html2canvas`), what the file size looks like for a multi-section CV, and
   what it costs in shipped JS on a site that currently ships almost none.
2. **Print stylesheet plus browser "Save as PDF".** Zero dependencies, real
   selectable text, real links. Find out what `@media print` can and cannot
   control — page breaks, headers/footers, link URL expansion — and how much
   of the CV layout has to be duplicated.
3. **A hand-maintained static PDF** (LaTeX or otherwise) served from `public/`.
   Best typographic result, at the cost of the CV existing in two places that
   drift apart.

Also worth establishing: what academic readers actually expect from a CV link —
an HTML page, a PDF, or both — and whether the PDF is expected to be
ATS-parseable.

Capture findings as a markdown file in the repo and link it from this ticket's
answer. Do not decide the CV's *content* here; that follows once the mechanism
is known.

## Answer

Findings: [.scratch/academic-restyle/research/cv-pdf-export.md](../research/cv-pdf-export.md).

**Approaches 2 and 3 together.** A `/cv` HTML page with a `@media print` stylesheet,
plus a hand-maintained `public/cv.pdf` printed from that page as the "Download PDF"
target. Approach 1 is rejected, and `jspdf`, `html2canvas` and `@types/jspdf` should be
removed from `package.json` when the CV is built.

Three facts decide it:

1. **Approach 1 is already broken on this site, and breaks invisibly.** html2canvas
   1.4.1 supports only `hsl/hsla/rgb/rgba` and throws on anything else. This site uses
   `color-mix()` in 14 places, including `src/styles/formal.css`, which Chrome computes
   to `oklab(…)` / `color(srgb …)`. Run against the real built pages it succeeds at
   1440 / 1024 / 794 px and **throws at 390 px**, because the offending elements are
   `display: none` on desktop. A download button built this way works on the author's
   machine and crashes for mobile readers. Last release 2022-01-22; the README itself
   advises against production use.
2. **Roughly 82× this site's client JavaScript, for one button.** The site currently
   ships 2,205 bytes gzipped and hydrates nothing. jspdf + html2canvas add ~182 KB
   gzipped.
3. **The raster route produces a photograph; the print route produces a document.**
   Byte-level comparison: the html2canvas PDF has zero text operators, zero link
   annotations, zero embedded fonts, at 610–950 KB. Browser print-to-PDF of the same
   content is 42 KB with embedded fonts, real link annotations for `http` and `mailto`,
   a tagged/accessible structure and a bookmark outline. Google Scholar's inclusion
   guidelines require searchable text in PDFs, which the raster route cannot provide.

Print-to-PDF also handled the things usually assumed broken: `break-inside: avoid` held
in block, flex and grid; `@page { size; margin }` was honoured; `attr(href)` link
expansion worked; nav was hidden.

**Constraint for whoever builds the CV**: lay it out in plain block flow, not grid or
tables. Cross-browser data shows Firefox fragments grid at 37% and tables at 28% of
WPT, and `break-after: avoid` on headings is a silent no-op in both Firefox and Safari
— only `break-inside` is portable. Safari runs none of WPT's print reftests, so its
print behaviour is structurally unmeasured. That unmeasured gap is the main reason to
commit a static PDF rather than rely on readers pressing Cmd-P.

**ATS-parseability is not an academic requirement** — Interfolio and AJO are
human-review systems — but the text layer it depends on is needed regardless.

### What this surfaced

Of 28 sampled researcher homepages, **20 link no CV at all**; publications plus a
Scholar profile does the job. Of the 8 that do link one, 7 point at a static `.pdf` and
none at an HTML page. This sits against map decision 9, which committed to a CV page
with PDF export, and is now ticket 08.

### Correction to the agent's report

The findings note claims `astro build` fails on `master` because `sectionHue` is
imported but not exported. That was a mid-flight snapshot of ticket 01's edits. Both
`pnpm build` and `pnpm astro check` pass on the finished tree, and `sectionHue` no
longer appears anywhere in `src/`.

## Comments
