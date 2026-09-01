# 06 — About page: timeline plus absorbed awards

Type: prototype
Status: open
Blocked by: 02, 03

## Question

How do the 19 absorbed event entries present inside the About page without
setting its centre of gravity, and what does the rest of the About page become
under the new register?

Ticket 03 guarantees the entries are reachable; this ticket decides what they
look like. `src/pages/about/index.astro` currently carries a photo badge, an
experience timeline, an education timeline and a skills grid — four hue-carrying
regions, of which only the org timeline keeps a hue under map rule 3.

Decisions this ticket must land:

- **Form for the 19 entries.** A dense mono list (year, name, result) is the
  academic convention for an awards section and is the recommendation to beat.
  Alternatives: grouped by type, collapsed behind a disclosure, or top-N with
  the rest folded away.
- **Whether the per-row emoji survive.** Since ticket 01 took the hue off this page,
  the 🏆 / 🥈 / 🛠️ / 💻 leading each row are the only colour left in the list, and
  they read as conspicuous against everything else. Decide deliberately rather than
  carrying them across by default.
- **Section title.** "Awards & Competitions", "Honours", or split into awards
  versus participation — 19 entries almost certainly are not all awards, and
  calling participation an award is the kind of overclaim an academic reader
  notices.
- **What happens to the skills grid.** It loses its hue under rule 3; decide
  whether a skills grid belongs on an academic site at all, or whether it
  becomes a prose line.
- **Whether the education timeline gets promoted** — degrees, advisors and
  institutions are load-bearing academic metadata and are currently presented
  the same as employment.
- Whether About and the CV page (ticket 07) overlap enough that one should link
  to the other rather than repeat it.

## Comments
