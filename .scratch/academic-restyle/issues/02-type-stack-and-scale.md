# 02 — Type stack and typographic scale

Type: prototype
Status: open
Blocked by: —

## Question

What exactly does "Source Serif 4 headings, IBM Plex Sans body, JetBrains Mono
labels" look like as a scale, and does it actually hold up on this site's real
content?

The stack is settled (map rule 5); the *scale* is not. Build a prototype page
that puts the real content through it — a long publication title with ten
authors, a section header, a mono label, body copy at the intended measure —
and judge it rather than guessing.

Decisions this ticket must land:

- The size ramp: `h1`/`h2`/`h3`, body, small, label. Where the serif stops and
  the sans starts.
- Weights actually loaded, kept minimal — the current font link already pulls
  five Plus Jakarta weights, and swapping to two families is a chance to shrink
  rather than grow the request.
- Measure (line length) for body copy, and whether `--max-w: 1160px` survives
  contact with a serif heading and a Distill-style reading column.
- Line height and letter-spacing per role. Current `body { line-height: 1.65 }`
  was tuned for Plus Jakarta and will not transfer unchanged.
- Whether `.label` / `.label-strong` keep uppercase mono, or whether the serif
  heading now carries enough signal that the mono label above it is redundant.
- Numerals: whether to use tabular/lining figures for dates, counts and
  publication numbering.

Also settle the loading strategy — the layout currently pulls fonts from Google
Fonts with a `preconnect` pair, and two new families is the moment to decide
whether that stays or the fonts get self-hosted.

## Comments
