# Agent context: rufflogix.github.io

- Astro 5 static personal site, deployed by GitHub Actions from `master` (not `main`).
- Content lives in `src/constants/*.constant.ts`. Pages are `src/pages/*/index.astro`; shared styles and tokens are in `src/styles/formal.css`.
- Design decisions are recorded in `.scratch/academic-restyle/map.md`. Read its "Settled in charting" list before changing visual design.
- Colour rule: amber means research, slate means engineering, and everything else stays ink. See `src/utils/hue.ts`.
- Type: Source Serif 4 for headings, IBM Plex Sans for body, JetBrains Mono for labels. All self-hosted in `public/fonts`.
- Medium posts are fetched at build time in `src/utils/medium.ts`.
- Check changes with `pnpm astro check` and `pnpm build`, then look at the rendered page at desktop and 390px, in both themes.
