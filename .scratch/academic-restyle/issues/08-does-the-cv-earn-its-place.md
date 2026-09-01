# 08 — Does the CV earn its place?

Type: grilling
Status: open
Blocked by: —

## Question

Map decision 9 committed to shipping a CV page with PDF export. Ticket 07's research
undercuts the premise: of 28 sampled researcher homepages, 20 link no CV at all —
publications plus a Google Scholar profile does the job. Of the 8 that do, 7 point at a
static `.pdf` and none at an HTML page.

So: does this site ship a CV, and in what form?

The options, in rough order of cost:

(a) **No CV.** Publications page plus Scholar / ORCID links carry the same information
    for the audience that asks for it. Decision 9 is amended and the work disappears.
(b) **A static `public/cv.pdf` only**, linked from About and the footer, no `/cv`
    route. Matches what 7 of the 8 CV-linking sites in the sample actually do.
(c) **A `/cv` HTML page plus a static PDF printed from it**, as ticket 07 recommends
    on mechanism grounds. Most work; also the only option that keeps the CV in the
    same place as the rest of the content rather than in a second artifact that drifts.

Note that (c) is what ticket 07 recommends *if a CV is built at all* — 07 answered the
mechanism question, not this one.

Two things to settle alongside the choice:

- **Whether a CV gets a nav slot.** The IA agreed in charting is
  `Publications · Work · Writing · About`, with no CV. If (b) or (c) wins, the link
  probably belongs inside About rather than in the nav. This overlaps ticket 03.
- **What the CV would contain that About does not.** If the honest answer is "the same
  timeline in a different layout", that is an argument for (a) or (b).

If the answer is (a), ticket 07's recommendation still stands as a resolved fact for
any future effort, and `jspdf` / `html2canvas` / `@types/jspdf` should be dropped from
`package.json` regardless — nothing imports them today.

## Comments
