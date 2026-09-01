# 04 — Publications as the site's academic centrepiece

Type: prototype
Status: open
Blocked by: 01, 02

## Question

Redesign `src/pages/publications/index.astro` so it carries the academic
substance the whole effort is for. This is the page that decides whether the
site reads as a researcher's or not.

**Read ticket 01's answer first.** Much of the affordance list below is already built:
the page renders numbered entries, full author lists with the site owner bolded, DOI
and PDF links, a per-entry BibTeX disclosure and an area tag today. Treat this as a
redesign of a working page, not a build from scratch, and confirm what exists before
writing anything.

The data is already there in `src/constants/publication.constant.ts` —
`abstract`, `doi`, `doiLink`, `pdfLink`, `authors`, `selfAuthorIndex`, `area`,
`venue`, `date`, `type` — and is currently under-displayed. The affordances
that must land (map rule 9):

- Numbered entries, reverse-chronological, paper-style.
- Full author lists, self emphasised, never truncated to "et al.".
- Venue and year given real prominence.
- DOI and PDF links per entry.
- Abstract expand/collapse per entry.
- Per-entry BibTeX copy — `src/utils/citation.ts` already has `toBibtex`, and
  `src/pages/rufflogix.bib.ts` already serves the bulk file, so this is a
  presentation change rather than new machinery.
- ORCID and Semantic Scholar profile links alongside the existing Google
  Scholar link and bulk BibTeX download.

Open questions the resolving session owns:

- The existing venue-type legend is derived from the data. With five hues gone,
  does a legend still make sense, or does the type become a mono label on each
  entry?
- Does `area` become a grouping (entries under "Computer Graphics" / "Medical
  Imaging AI" / "Formal Verification" headings) or stay a per-entry tag? Three
  entries across three areas makes grouping look sparse.
- Whether the copy-to-clipboard interaction needs a client island or can be
  done with a small inline script — the site currently ships almost no
  client-side JS.
- Whether three entries is enough to justify the page header's `03 entries`
  counter, or whether that draws attention to thinness.

Prototype the entry component first and look at it before committing.

## Comments
