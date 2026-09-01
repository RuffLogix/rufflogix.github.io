# Research: how the CV page should produce a downloadable PDF

Ticket: [`../issues/07-cv-page-and-pdf-export.md`](../issues/07-cv-page-and-pdf-export.md)
Researched: 2026-09-02

---

## Recommendation

**Ship a `/cv` HTML page with a `@media print` stylesheet, and hand-maintain a
static PDF in `public/` as the thing the "Download PDF" link actually points
at.** That is options 2 and 3 together. Reject option 1 outright.

Concretely:

- `/cv` is a real HTML page, generated from the same `src/constants/*.constant.ts`
  data the rest of the site already uses. This is the canonical CV.
- A print stylesheet makes `Cmd-P → Save as PDF` produce a correct document, so
  the page is self-sufficient and can never go stale.
- A "Download PDF" link points to `public/cv.pdf` — a file produced by printing
  that page and committing the result. No build step, no LaTeX, no second source
  of truth for the *content*, only for the *artifact*.
- Delete `jspdf`, `html2canvas` and `@types/jspdf` from `package.json`.

### The three facts that decide it

1. **Option 1 is already broken on this site — and broken *invisibly*.**
   html2canvas supports exactly four colour functions (`rgb`, `rgba`, `hsl`,
   `hsla`); this site uses `color-mix()` in 14 places including the core
   stylesheet, which Chrome computes to `oklab()` / `color(srgb …)`. Run against
   the real built pages it succeeds at 1440/1024/794 px and **throws at 390 px**,
   because the offending elements are `display: none` on desktop. A download
   button built this way would work on the machine you develop on and crash for
   mobile readers ([§1](#1-option-1-is-not-merely-worse--it-is-broken-on-this-sites-css)).
2. **Option 1 costs ~82× the site's entire client JavaScript.** The site ships
   2,205 bytes gzipped in total and hydrates nothing; jspdf + html2canvas add
   ~182 KB gzipped ([§2](#2-the-bundle-cost-is-82-the-sites-entire-client-javascript)).
3. **Its output is a photograph, and Google Scholar says so.** The generated PDF
   contains zero text-showing operators, zero link annotations and zero embedded
   fonts, at 610 KB–950 KB — versus 42 KB of real vector text with working link
   annotations from the print route. Scholar's inclusion guidelines require that
   *"PDF files must have searchable text"*
   ([§1g](#1g-the-output-is-a-photograph-of-a-webpage), [§3](#3-print-to-pdf-works-including-the-parts-usually-claimed-broken), [§4e](#4e-the-text-layer-is-needed-regardless-of-ats--and-html-first-is-policy)).

Any one of these would be sufficient. Together there is nothing left to weigh.

### Why not option 3 alone (static PDF only)

Because a PDF-only CV is invisible to the site's own crawlers and unpleasant on a
phone, and because the strongest accessibility authority found says the opposite.
[Section508.gov](https://www.section508.gov/create/pdfs/):

> "PDFs are still used across government, but they are often not the most
> accessible or mobile-friendly option. **Federal policy requires agencies to
> prioritize HTML and use PDFs only when necessary.**"

The HTML page is also the cheap part — it reuses data that already exists in
`src/constants/`.

### Why the static PDF at all, given print-to-PDF works

Three reasons, all about the reader rather than the author:

1. **Safari's print-to-PDF behaviour is unverifiable.** No WebKit documentation
   confirms it preserves link annotations, and Safari does not run any of
   web-platform-tests' print reftests — of 258 `/css/css-page/` tests it runs 34.
   A Safari reader may get a materially different PDF from the one you checked,
   and neither of you would know ([§3j](#3j-the-one-real-weakness-safari-is-unmeasured)).
   A committed file is the same bytes for everyone.
2. **Page numbers only work in Chrome.** `@page` margin boxes with
   `counter(page)` shipped in Chrome 131 but are absent from Firefox and Safari
   ([§3g](#3g-page--including-a-correction-to-the-usual-advice)).
3. **Academic convention is a link that yields a file.** Of 28 researcher
   homepages sampled, 8 link a CV and **7 of those 8 point at a static `.pdf`**;
   zero point at an HTML CV page ([§4a](#4a-observable-evidence-what-real-researchers-do-28-site-sample)).
   Making the reader discover `Cmd-P` is worse than a link.

This is also exactly what al-folio (16.1k stars) does: one structured source →
an HTML page plus a `cv_pdf:` pointing at a static asset
([§4b](#4b-observable-evidence-what-the-dominant-templates-do)).

**On drift.** The risk is real and observable in the wild — Emma Brunskill's live
Stanford faculty page still links `brunskill_cv_June_2020.pdf`. But it is bounded
here, because the PDF is *printed from the page*, not authored separately.
Regenerating it is one print action, not a re-typesetting job — a categorically
smaller cost than maintaining a parallel LaTeX document.

### One thing to flag upward

Of the 28 researcher homepages sampled, **20 (71%) link no CV at all** — the
publications list plus Google Scholar does the job. That is worth putting to the
map against decision 9's "a CV page with PDF export." The affordance is
defensible, but it is not the load-bearing one; Publications is. Whether `/cv`
earns a nav slot is an IA question for ticket 03.

---

## 1. Option 1 is not merely worse — it is broken on this site's CSS

This is the finding that settles the ticket, and it is measured, not inferred.

### 1a. html2canvas supports exactly four colour functions

From the shipped source in this repo,
`node_modules/html2canvas/dist/html2canvas.js:1837`:

```js
var SUPPORTED_COLOR_FUNCTIONS = {
    hsl: hsl,
    hsla: hsl,
    rgb: rgb,
    rgba: rgb
};
```

and at lines 1724–1726:

```js
var colorFunction = SUPPORTED_COLOR_FUNCTIONS[value.name];
if (typeof colorFunction === 'undefined') {
    throw new Error("Attempting to parse an unsupported color function \"" + value.name + "\"");
}
```

`rgb`, `rgba`, `hsl`, `hsla`, and nothing else. No `oklch`, `oklab`, `lab`,
`lch`, `color()` or `color-mix()`.

### 1b. This site uses `color-mix()` in 14 places

Including four times in the core stylesheet `src/styles/formal.css`
(lines 112, 113, 229, 514), and throughout `src/pages/index.astro`,
`projects/index.astro`, `events/index.astro`, `about/index.astro`.

### 1c. Computed styles do not rescue it — verified in Chrome 151

html2canvas reads computed styles, so a reasonable hope is that the browser
resolves `color-mix()` down to `rgb()` before html2canvas ever sees it. It does
not. Measured directly:

| Authored CSS | `getComputedStyle()` returns |
| --- | --- |
| `color-mix(in oklab, var(--ink) 60%, transparent)` | `oklab(0.925643 0.000971973 0.00450724 / 0.6)` |
| `color-mix(in srgb, #D9A05B 40%, transparent)` | `color(srgb 0.85098 0.627451 0.356863 / 0.4)` |
| `oklch(0.72 0.11 65)` | `oklch(0.72 0.11 65)` |

All three are outside the allowlist. Running html2canvas 1.4.1 over an element
styled this way produced, in Chrome 151:

```
html2canvas: THREW -> Attempting to parse an unsupported color function "color"
```

**Option 1 throws on this site's stylesheet as it stands.** Making it work would
mean forbidding `color-mix()` anywhere the CV page can see — a palette
restriction imposed by a download button, which inverts the priority.

This is a well-known breakage, not a local quirk. It is the standard failure when
Tailwind v4 (which emits `oklch` by default) meets html2canvas, and it is open
upstream in a long list of issues —
[#2700](https://github.com/niklasvh/html2canvas/issues/2700) (33 reactions, open
since 2021), [#3269](https://github.com/niklasvh/html2canvas/issues/3269),
[#3235](https://github.com/niklasvh/html2canvas/issues/3235),
[#3150](https://github.com/niklasvh/html2canvas/issues/3150),
[#3148](https://github.com/niklasvh/html2canvas/issues/3148),
[#3204](https://github.com/niklasvh/html2canvas/issues/3204),
[#3272](https://github.com/niklasvh/html2canvas/issues/3272),
[#3278](https://github.com/niklasvh/html2canvas/issues/3278) — with fix PRs
[#3236](https://github.com/niklasvh/html2canvas/pull/3236) and
[#3256](https://github.com/niklasvh/html2canvas/pull/3256) open and unmerged.
Since the last commit to `master` was 2022-01-22, they will not land.
This repo runs `tailwindcss@^4.1.11`.

### 1d. It already breaks on this site's built pages — at mobile widths only

The most damning measurement. html2canvas 1.4.1 was run against the actual built
pages served over HTTP, at four viewport widths:

| Page | 1440px | 1024px | 794px | **390px** |
| --- | --- | --- | --- | --- |
| `/about/` | OK | OK | OK | **THREW** `unsupported color function "color"` |
| `/projects/` | OK | OK | OK | **THREW** `unsupported color function "color"` |
| `/`, `/publications/`, `/articles/`, `/events/` | OK | OK | OK | not retested |

The `color-mix()` borders and backgrounds live in elements that are `display: none`
at wide widths and visible at narrow ones. So a "Download PDF" button built this
way **works on the desktop you develop on and hard-crashes for mobile readers.**

That is the worst possible failure shape: invisible in development, broken for a
subset of real users, and dependent on viewport rather than anything you would
think to test.

### 1e. html2canvas is unmaintained, and says so itself

(jsPDF, by contrast, is healthy — 4.2.1 released 2026-03-17, last push
2026-08-28, 116 open issues+PRs. The problem is specifically html2canvas.)

- Latest release **1.4.1, published 2022-01-22** — four and a half years ago per
  the [npm registry](https://registry.npmjs.org/html2canvas). Last commit to
  `master` is the same date.
- **974 open issues, 77 open pull requests**
  ([repo](https://github.com/niklasvh/html2canvas)).
- The README's own status statement:

  > "The script is still in a **very experimental state**, so I don't recommend
  > using it in a production environment nor start building applications with it
  > yet, as there will be still major changes made."

- And the [official FAQ](https://github.com/niklasvh/html2canvas/blob/master/docs/faq.md)
  forecloses the obvious hope:

  > "As each CSS property needs to be manually coded to render correctly,
  > html2canvas will **never** have full CSS support."

- Its [documented feature list](https://github.com/niklasvh/html2canvas/blob/master/docs/features.md)
  explicitly does **not** support `box-shadow`, `filter`, `mix-blend-mode`,
  `object-fit`, `background-blend-mode`, `border-image`, `writing-mode`,
  `repeating-linear-gradient()` or `zoom`; `transform` is "Limited support";
  `text-decoration-style` supports only `solid`; and **CSS Grid is absent from
  the supported-property list entirely** (only `flex` is listed).

- The FAQ also documents canvas size ceilings a long CV will hit: iOS caps at
  "5 megapixels". A measured render of this site's `/about/` at `scale: 2` was
  **1588 × 12428 = 19.7 MP — roughly 4× the documented iOS ceiling.**

### 1f. The escape hatch, and why it does not change the answer

A maintained fork exists — [html2canvas-pro](https://github.com/yorickshan/html2canvas-pro)
(latest 2.4.1, published 2026-09-01, 0 open issues), whose README advertises
"Color functions `color()` (incl. relative colors), `lab()`, `lch()`, `oklab()`,
`oklch()`". Verified by measurement: where html2canvas 1.4.1 throws on
`color-mix()`, `oklch()`, `lab()` and `color()`, html2canvas-pro renders all four.

But this only removes the crash. It leaves every other objection intact — the
bundle cost (it is *larger*, 62 KB gzip vs 46 KB), and the fact that the output
is still a picture (§1g). It is also not a drop-in: on the upstream issue thread
a user reports *"when I'm using html2canvas-pro I have an issue with spacings …
after generating canvas the spacings are different"*
([#3269](https://github.com/niklasvh/html2canvas/issues/3269)).

### 1g. The output is a photograph of a webpage

I rendered a 6-entry mock CV at the standard `scale: 2` and embedded the canvas
into jsPDF with the usual multi-page offset loop. Structural analysis of the
resulting PDF:

```json
{"bytes":192773, "image_xobjects":1, "dctdecode":1,
 "text_show_ops_Tj":0, "link_annots":0, "uris":0, "has_FontFile":false}
```

**Zero text-showing operators. Zero link annotations. Zero embedded fonts.** One
JPEG. Nothing in that PDF can be selected, copied, ctrl-F'd, read by a screen
reader, indexed by a crawler, or parsed by any resume parser.

This is inherent, not a misconfiguration: html2canvas's stated purpose is that it
"renders the current page as a **canvas image**, by reading the DOM and the
different styles applied to the elements" and "builds the **screenshot**"
([README](https://github.com/niklasvh/html2canvas)). A canvas has no text; it has
pixels. jsPDF's `addImage` then embeds those pixels.

**An important nuance, in fairness to jsPDF.** jsPDF's own `.html()` method is
*not* the same thing and does **not** rasterise. In
[`src/modules/html.js`](https://github.com/parallax/jsPDF/blob/master/src/modules/html.js)
the `toCanvas()` branch is commented out; `.html()` routes through
`toContext2d()`, which hands html2canvas a jsPDF `CanvasRenderingContext2D` shim
that translates paint calls into PDF operators — `fillText` → `pdf.text()`, i.e.
real `BT`/`Tj` text. Measured on a trivial page: 36 `Tj` operators, extractable
text. So "jsPDF + html2canvas" is really two options, and conflating them would
be unfair.

It does not rescue option 1 here, for three reasons:

1. It still depends on html2canvas 1.4.1 (`optionalDependencies: {"html2canvas":
   "^1.0.0-rc.5"}`), so it inherits the colour crash of §1c–1d.
2. Its `fontFaces` option only matches `format === "truetype"` — **WOFF/WOFF2,
   which is what this site loads from Google Fonts, is not matched.**
3. Measured against this site's actual `/about/` page, `pdf.html()` produced
   **six blank A4 pages** — 5,497 bytes, zero text operators, zero images. It did
   not throw; it silently emitted white rectangles. (Root cause not isolated;
   recorded as a reproducible failure, not a diagnosis.)

### 1h. File size for a multi-page CV

Measured two ways, on this site's real pages and on a mock CV.

**Properly implemented** (slice the canvas into A4 tiles, one image per page),
against this site's built `/about/` — canvas 1588 × 12428 → 6 A4 pages:

| Encoding | Output PDF |
| --- | --- |
| PNG (jsPDF Flate) | **624,369 B (610 KB)** |
| PNG + `compression: 'SLOW'` | 624,369 B — identical; the flag is a no-op for PNG |
| **JPEG q=1.0** — what `addImage(canvasElement, 'JPEG', …)` actually does | **975,062 B (952 KB)** |
| JPEG q=0.92 (requires bypassing `addImage`'s canvas path) | 175,661 B |
| JPEG q=0.7 | 123,244 B |

Note the q=1.0 row: `addImage` hardcodes `element.toDataURL(mimeType, 1.0)` when
handed a canvas element, so the naive path is pinned to maximum quality. **The
realistic figure for a 5–6 page CV is 0.6–1.0 MB.** Getting to ~175 KB means
bypassing `addImage`'s canvas handling and accepting visible JPEG ringing on
11 pt body text.

**Naively implemented** — the most commonly copy-pasted recipe, which re-embeds
the *entire* full-height image on every page and offsets it:

| Route | Output PDF | Pages |
| --- | --- | --- |
| `toDataURL('image/png')` → `addImage(…, 'PNG')` | **34,383,692 B (34.4 MB)** | 3 |
| `toDataURL('image/jpeg', 0.85)` → `addImage(…, 'JPEG')` | 192,773 B | 3 |

The 34 MB is not a typo — it is image data duplicated per page. Flagged because
it is what the standard tutorial produces, not because it is unavoidable.

Either way, compare against **42 KB** for the print route (§3).

*Honest note:* there is no official jsPDF figure for canvas-screenshot output
size. Searching the tracker turns up only user reports —
[#3178](https://github.com/parallax/jsPDF/issues/3178) (open since 2021: *"a 50kb
image that blows up the PDF to 3.3mb with nothing else in it"*, and *"compression:
'FAST' // Doesn't do anything"*) and
[#2885](https://github.com/parallax/jsPDF/issues/2885). The numbers above are
measurements, not vendor claims.

One further artifact: the raster route scales a fixed-width DOM render down to
210 mm rather than reflowing, so type size in the output becomes a function of
render width, not a typographic decision — the opposite of what a map anchored on
Distill.pub's typographic contract wants.

---

## 2. The bundle cost is ~82× the site's entire client JavaScript

### What this site ships today

| Measure | Value |
| --- | --- |
| Inline `<script>` source across all `.astro` files | 6,367 B raw / **2,205 B gzipped** |
| Number of inline scripts | 5 |
| Components with a `client:*` hydration directive | **0** |
| `.tsx` / `.jsx` files in `src/` | **0** |

`react`, `react-dom`, `gsap`, `lucide-react`, `nanostores`, `jspdf` and
`html2canvas` are all in `package.json`, but **none of them reach the browser** —
there is not one hydrated component on this site. The `manualChunks` config in
`astro.config.mjs` splits `gsap` and `react-vendor` into vendor chunks that are
never emitted, because nothing imports them.

### What option 1 would add

Measured from the installed packages (jspdf 3.0.3, html2canvas 1.4.1):

| File | Raw | Gzipped |
| --- | --- | --- |
| `html2canvas/dist/html2canvas.esm.js` | 410,432 B | **72,554 B** |
| `jspdf/dist/jspdf.es.min.js` | 342,609 B | **109,257 B** |
| (min/UMD variants, for reference) | | 46,071 B / 131,966 B |

The ESM builds are what a Vite/Astro bundle pulls in: **~182 KB gzipped** for the
pair.

> 2,205 bytes → 184,016 bytes. **An ~82× increase in shipped JavaScript, to add
> one button**, on a site whose defining engineering characteristic is that it
> ships almost none.

Given the map's constraint that this site read as competent engineering work,
shipping 182 KB of JS to produce a worse artifact than the browser produces for
free is the single most legible anti-signal available.

### Incidental cleanup

`@types/jspdf@2.0.0` is a dead stub regardless of what is decided. Its own
`package.json`:

```json
"typings": null,
"description": "Stub TypeScript definitions entry for jspdf, which provides its own types definitions"
```

---

## 3. Print-to-PDF works, including the parts usually claimed broken

Measured in Chrome 151 against a mock CV with a `@media print` block. Result:
**42,043 bytes, 6 pages** — versus 188 KB (JPEG) or 34.4 MB (PNG) for the raster
route.

### 3a. Real text, real fonts, real links

- `pdftotext -layout` recovered the full document cleanly.
- The PDF contains embedded font programs (`FontFile2`) and **no image XObjects
  at all** — vector text end to end.
- Raw structure shows `2 × /Subtype /Link` with URIs
  `https://example.org/profile` and `mailto:a@b.c`. **Both `http` and `mailto`
  survive as clickable PDF link annotations.**

This is not incidental behaviour; it is deliberate and traceable in Blink.
`LocalFrameView::PrintPage` sets `PaintFlag::kAddUrlMetadata`
([local_frame_view.cc](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/frame/local_frame_view.cc)),
whose declaration reads:

```cpp
// Used when printing or painting a preview to in order to add URL
// metadata for links.
kAddUrlMetadata = 1 << 2,
```

`ObjectPainter::AddURLRectIfNeeded` then distinguishes external links
(`SetURLForRect`) from same-document fragments (`SetURLFragmentForRect`), which
map to Skia's `SkAnnotateRectWithURL` and `SkAnnotateLinkToDestination`
([skia_paint_canvas.cc](https://source.chromium.org/chromium/chromium/src/+/main:cc/paint/skia_paint_canvas.cc)).
**So internal anchor links survive as PDF named destinations too** — a
table-of-contents on the CV page would remain clickable in the PDF.

One trap worth knowing: that code path skips elements whose
`Visibility() != EVisibility::kVisible`. **`visibility: hidden` destroys the link
annotation**; use `display: none` for print-hiding instead.

Firefox does the same, and its internal destinations are on by default —
`print.save_as_pdf.links.enabled: true` and
`print.save_as_pdf.internal_destinations.enabled: true` in Gecko's
[StaticPrefList.yaml](https://github.com/mozilla/gecko-dev/blob/master/modules/libpref/init/StaticPrefList.yaml).
(Older advice that internal links need an `about:config` flip is superseded.)

**Safari is unverified.** No WebKit source or documentation could be found
confirming or denying PDF link annotations from Safari's print path, which routes
through CoreGraphics rather than Skia or cairo. See §3h.

### 3b. Bonus: Chromium print-to-PDF produces a *tagged* (accessible) PDF

Since Chrome 85, `MetafileSkia::FinishDocument()` passes an
`accessibility_tree_` and `generate_document_outline_` into the PDF document
([metafile_skia.cc](https://source.chromium.org/chromium/chromium/src/+/main:printing/metafile_skia.cc)),
feeding Skia's `StructureElementNode` tree, which carries `fTypeString`,
`fAttributes`, `fAlt` and `fLang`
([SkPDFDocument.h](https://github.com/google/skia/blob/main/include/docs/SkPDFDocument.h)).

**Practical consequence: semantic HTML on the CV page (`<h1>`/`<h2>`, `<ul>`,
`<section>`) flows through into PDF structure tags, a PDF bookmark outline, `alt`
text and `lang`.** This is a real accessibility win that a canvas screenshot can
never have, and it is free.

### 3c. `break-inside: avoid` works — in block flow, flex, AND grid (Chrome)

This is the one I expected to fail, because Chromium historically ignored
fragmentation properties inside flex and grid containers. **It does not fail in
Chrome 151.**

I placed six 500 px-tall `break-inside: avoid` entries — two inside a
`display: grid` parent, two inside a `display: flex` parent, two in normal block
flow. Every one was pushed whole onto its own page; not one was split:

| Page | Content |
| --- | --- |
| 1 | heading, contact line, GRID-ENTRY-A (whole) |
| 2 | GRID-ENTRY-B (whole) |
| 3 | FLEX-ENTRY-C (whole) |
| 4 | FLEX-ENTRY-D (whole) |
| 5 | BLOCK-ENTRY-E (whole) |
| 6 | BLOCK-ENTRY-F (whole) |

The Chromium gap closed in **Chrome 103**, which shipped flex and grid
fragmentation in LayoutNG (printing followed in Chrome 108) —
[RenderingNG fragmentation deep-dive](https://developer.chrome.com/docs/chromium/renderingng-fragmentation).

MDN rates [`break-inside`](https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside)
**"Baseline Widely available … since January 2019"** (Chrome 50, Firefox 65,
Safari 10).

### 3d. But two fragmentation facts my probe could not see

My probe was Chrome-only. Cross-browser data changes the guidance materially:

**1. `break-before: avoid` and `break-after: avoid` do not work in Firefox or
Safari at all.** Per MDN's browser-compat-data for
[`break-before`](https://github.com/mdn/browser-compat-data/blob/main/css/properties/break-before.json),
both browsers record `false` with the note *"The value is recognized, but has no
effect"* ([Firefox bug 1972340](https://bugzilla.mozilla.org/show_bug.cgi?id=1972340),
[WebKit bug 294559](https://bugs.webkit.org/show_bug.cgi?id=294559), both open).
Worse, both engines *lie* via `CSS.supports()`. caniuse states it plainly:
*"Partial support is due to not supporting `avoid` for `page-break-before` &
`page-break-after` (only `page-break-inside`)."*

> **Consequence: the classic "don't leave a section heading stranded at the
> bottom of a page" trick — `h2 { break-after: avoid }` — silently does nothing
> for most non-Chrome readers.** Only `break-inside: avoid` is portable. Wrap the
> heading and its first entry in a container and put `break-inside: avoid` on
> that instead.

**2. Firefox and Safari fragmentation inside grid and tables is genuinely weak.**
web-platform-tests pass rates (Chrome 152 / Firefox 154 / Safari 26.6):

| WPT directory | Chrome | Firefox | Safari |
| --- | --- | --- | --- |
| `/css/css-break/` (all) | **97%** | 60% | 60% |
| `/css/css-break/flexbox/` | **98%** | 64% | 52% |
| `/css/css-break/grid/` | **93%** | **37%** | 63% |
| `/css/css-break/table/` | **98%** | **28%** | 59% |
| orphans/widows | **100%** | **29%** | 77% |

[rachelandrew/gridbugs #3](https://github.com/rachelandrew/gridbugs) remains open:
*"There is limited fragmentation support across browsers at present, therefore
features such as the `break-*` properties are unlikely to work reliably."*

> **Consequence: lay the printed CV out in plain block flow, not grid and not
> tables.** That is the only construction all three engines fragment correctly.
> This is a real constraint on the CV page's markup, and the cheapest one to
> honour if the page is designed as a linear document from the start.

Also use `break-inside: avoid` rather than `avoid-page` (Safari records `false`
for `avoid-page`), and ship the legacy `page-break-inside: avoid` alias alongside
it — broader support, zero downside.

### 3e. Hiding chrome works

`nav { display: none }` inside `@media print` removed the nav from all 6 pages.
This is also MDN's own documented recommendation
([Printing guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing)):

> ```css
> @media print {
>   #header, #footer, #nav { display: none !important; }
> }
> ```

### 3f. Expanding link URLs works

With `a[href^="http"]::after { content: " (" attr(href) ")" }`, page 1 rendered:

```
Contact: my profile (https://example.org/profile) and email.
```

`attr()` in `content` is the most portable trick in this whole section —
[BCD](https://github.com/mdn/browser-compat-data/blob/main/css/types/attr.json)
records Chrome 2 / Firefox 1 / Safari 3.1. (Only the *newer* typed forms —
`attr(x type(<length>))`, `attr()` outside `content` — are unevenly supported,
and none of that is needed here.)

Worth noting the expansion is arguably *redundant* for Chrome and Firefox
readers, since §3a shows links already survive as clickable annotations. It earns
its place for physical paper, and for Safari where annotations are unverified.
Apply it selectively — `[href^="http"]` at minimum, and realistically only to
DOIs and the site URL, or a publications list becomes unreadable.

### 3g. `@page` — including a correction to the usual advice

`@page { size: A4; margin: 18mm }` was honoured in the probe.

Per [MDN's `@page` reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@page),
the implemented descriptors are **`margin`, `size`, `page-orientation`** — that
is the whole list. MDN's "Remaining page properties" table notes the spec defines
many more (backgrounds, borders, `color`, `font`, `width`/`height`, …) but:

> "these have _not been supported_ by any user agent yet"

One Safari-specific trap: **Safari does not support the `size: landscape` /
`portrait` keywords** (BCD records `false`), nor `page-orientation`. `size: A4`
is fine; a landscape CV is not portable.

**Correction to the conventional wisdom on running headers/footers.** The
standard advice — repeated in Rachel Andrew's 2018 Smashing guide and still
widely cited — is that no browser supports `@page` margin boxes. **That is no
longer true for Chrome.** Chrome 131 (Nov 2024) shipped all 16 margin at-rules
plus the `page` and `pages` counters
([Chrome announcement](https://developer.chrome.com/blog/print-margins)):

```css
@page :right {
  @bottom-right { content: counter(page); }
}
```

> "From Chrome 131, you can use generated content to add content to the margins,
> by targeting the relevant margin at-rule."

BCD records all 16 as `chrome: 131, firefox: false, safari: false`. WPT confirms:
Chrome passes 58/61 of `/css/css-page/margin-boxes/`; Firefox fails all of them.

So: **real page numbering in the PDF is available, but only for Chrome readers.**
Treat it as progressive enhancement — a `@bottom-right { content: counter(page) }`
costs two lines and degrades to nothing elsewhere. Portable page numbering still
requires a paged-media engine (Prince, WeasyPrint, Paged.js), which is out of
scope, or the committed static PDF, which is in scope.

(Beware a false claim circulating that Safari 18.2 shipped margin boxes. WebKit's
own [Safari 18.2 feature post](https://webkit.org/blog/16301/webkit-features-in-safari-18-2/)
mentions only JIS page sizes and `size` descriptor parsing — no margin boxes.)

Separately, browsers inject **their own** header/footer — URL, date, page number
— which the reader toggles in the print dialog and CSS cannot control. Note
Chrome's documented interaction: setting page margins to zero removes that
automatic content entirely.

### 3h. Colours, the dark default, and one nasty gotcha

The site's dark-default theme must be explicitly overridden for print.
`print-color-adjust`'s initial value is `economy`, under which per
[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust) the UA
may drop background images and *"replace light-colored text on a dark background
with dark text on a white background."* But that is a suggestion, not a contract:

> "Any options the user agent offers the user to allow them to control the use of
> color and images will take priority over the value of `print-color-adjust`. In
> other words, there isn't any guarantee that `print-color-adjust` will do
> anything."

Chrome's "Background graphics" checkbox is exactly such an option, and it is
**off by default**. So force light explicitly rather than relying on `economy`.
My probe confirmed `body { background: #fff; color: #000 }` inside `@media print`
works.

**The gotcha, from BCD's notes on `print-color-adjust`:**

> "Chrome does not print backgrounds of the `<body>` element. If this property is
> set to `exact` for the `<body>` element, it will apply only to its
> descendants."

(The same note applies to Safari.) **A full-bleed background can never be printed
via `body { background: … }`** — it needs a wrapper element. For a CV this is
mostly moot, since white paper is what you want, but it matters if any hue is
ever meant to survive to print.

If you do force ink, ship both spellings: Chrome only shipped the unprefixed
`print-color-adjust` in v136, so `-webkit-print-color-adjust: exact` is still
required alongside it.

### 3i. How much layout duplication is actually required

Less than the ticket fears, but not zero. Each item below is grounded in a
finding above rather than folklore:

| Override | Why |
| --- | --- |
| Force light background + dark text | `economy` is only a hint; body backgrounds never print anyway (§3h) |
| `display: none` on nav, footer, theme toggle, download button | MDN Printing guide's own example (§3e). Use `display:none`, never `visibility:hidden` — that kills link annotations (§3a) |
| Grid / flex → plain block flow | Firefox grid fragmentation 37%, tables 28% (§3d) |
| `break-inside: avoid` on entry containers — **not** `break-after: avoid` on headings | `break-*: avoid` is a no-op in Firefox *and* Safari (§3d) |
| Ship `page-break-inside` alias alongside `break-inside` | Broader/older support, zero downside (§3d) |
| `@page { size: A4; margin: … }` | Works; avoid `size: landscape` (§3g) |
| Sizes in `pt` | Conventional for paged media |
| Do **not** rely on `orphans` / `widows` | Firefox does not support them — 29% WPT, and it fails even the *parsing* tests |
| Page numbers via `@bottom-right { content: counter(page) }` | Progressive enhancement, Chrome-only (§3g) |

This is one focused `@media print` block, not a duplicate template — **provided
the CV page is authored as a linear block-flow document from the start**, which
§3d says it must be anyway, and which is what a CV is. The cost of the print
stylesheet is proportional to how un-CV-like the CV page's screen layout is, and
that is entirely under our control.

`window.print()` is a one-line, zero-dependency call if a "Print" button is
wanted (Chrome 1 / Firefox 1 / Safari 1.1); MDN also documents
`beforeprint` / `afterprint` for adjusting UI around printing.

*Honest gap:* I found no primary source on how viewport units (`vh`/`vw`),
`position: fixed`/`sticky`, or multi-column behave in paged media. The usual
claims are widely repeated blog folklore. Neutralise them defensively in the
print block, but do not treat any specific claimed behaviour as established.

### 3j. The one real weakness: Safari is unmeasured

This is the honest counterweight, and it is why §Recommendation still commits a
static PDF.

- No WebKit source or documentation could be found confirming Safari's
  print-to-PDF preserves link annotations at all.
- Safari **does not run web-platform-tests' `*-print.html` reftests**. Of 258
  tests in `/css/css-page/`, Safari runs 34. **Safari's paged-media behaviour is
  structurally unmeasured**, so no confident cross-browser claim about what a
  Safari reader's `Save as PDF` produces is available from any source.

A reader on Safari may therefore get a materially different PDF from the one you
checked in Chrome, and neither of you will know. That is not a reason to skip the
print stylesheet — it costs nothing and helps every reader — but it is a decisive
reason not to make `Cmd-P` the *only* route to a PDF.

---

## 4. What academic readers actually expect

### 4a. Observable evidence: what real researchers do (28-site sample)

Homepages fetched and `href`s grepped for CV / vitae / résumé anchors:

| Outcome | Count |
| --- | --- |
| **No CV link at all** | **20 / 28 (71%)** |
| CV link present | 8 / 28 (29%) |
| — of those, pointing directly at a `.pdf` | **7 / 8** |
| — of those, pointing at an HTML CV page | **0 / 8** |
| **HTML CV page offered by any working researcher** | **0 / 28** |

The seven PDFs: Dan Jurafsky (`cv.pdf`), Emily M. Bender (`EmilyMBender_CV.pdf`),
Emma Brunskill (`brunskill_cv_June_2020.pdf`), Tom Mitchell (`resume.pdf`),
Ruslan Salakhutdinov (`cv_web.pdf`), Geoffrey Hinton (`shortcv.pdf`), Fei-Fei Li
(institutional profile PDF). The eighth, Yann LeCun, links a Google Doc.

The 20 with no CV link include Karpathy, Lilian Weng, Chris Olah, Sebastian
Ruder, Percy Liang, Jacob Steinhardt, Tim Dettmers, Chris Manning, Regina
Barzilay, Moritz Hardt, Zachary Lipton, Been Kim, Sanjeev Arora, Andrew Ng,
Kyunghyun Cho and others.

Three findings, all load-bearing:

1. **The most common choice among elite researchers is no CV link at all.** The
   publications list plus a Google Scholar link substitutes for it. This is worth
   surfacing against the map's decision 9, which lists "a CV page with PDF
   export" as a substance affordance — the affordance is real, but it is not the
   load-bearing one. Publications is.
2. **Where a CV link exists, it yields a file.** 7 of 8 are a static `.pdf`. Not
   an HTML page, and in no case a client-side-generated download.
3. **Drift is observable in the wild, not hypothetical.** Emma Brunskill's live
   Stanford CS faculty page links `brunskill_cv_June_2020.pdf` — a filename-dated
   PDF roughly five years stale. This is exactly the two-artifact failure mode
   the ticket worries about, caught in the field.

*Method caveat:* homepage-only grep, so a CV linked from a deeper "About" page
would be missed; six further sites failed to fetch and are excluded. Treat the
71% "no CV link" figure as an upper bound.

### 4b. Observable evidence: what the dominant templates do

| Template | Stars | CV page | PDF offered? | Drift-proof? |
| --- | --- | --- | --- | --- |
| [academicpages](https://github.com/academicpages/academicpages.github.io) | 17.5k (8.5k forks) | **HTML**, from hand-written Markdown (`_pages/cv.md`) | **No** PDF link by default | No — hand-maintained |
| [al-folio](https://github.com/alshedivat/al-folio) | 16.1k | **HTML**, generated from a single structured source | **Yes** — static asset | **Yes** — one source, two outputs |

al-folio's `_pages/cv.md` front matter is the whole design in five lines:

```yaml
layout: cv
permalink: /cv/
cv_pdf: /assets/pdf/example_pdf.pdf   # you can also use external links here
cv_format: rendercv                    # options: rendercv, jsonresume
```

One `cv.yml` / `resume.json` renders the HTML page; `cv_pdf` points the download
button at a **static file**. Crucially, **neither template generates the PDF
client-side.** The convention contains no jsPDF button anywhere.

al-folio is the shape to copy, with one honest caveat: its PDF is still a
separate artifact you place at `cv_pdf`, so it is drift-proof only if you
regenerate it from the same source. That is the same discipline §6 asks for.

### 4c. Is PDF the expected format?

Yes in practice — but the evidence is **observed behaviour, not prescription**,
and it is worth being precise about that because the canonical guides are silent.

Guides that say **nothing at all** about file format (each checked directly):
[Harvard GSAS *CVs and Cover Letters 2025*](https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2025/08/gsas-cvs-and-cover-letters-2025.pdf)
(a 57-page primary guide — zero hits for `pdf`, `file format`, or `Word
document`), [Purdue OWL](https://owl.purdue.edu/owl/job_search_writing/resumes_and_vitas/writing_the_cv.html),
[UNC Writing Center](https://writingcenter.unc.edu/tips-and-tools/curricula-vitae-cvs-versus-resumes/),
[UPenn Career Services](https://careerservices.upenn.edu/application-materials-for-the-faculty-job-search/cvs-for-faculty-job-applications/),
[UW](https://careers.uw.edu/resources/academic-careers-cvs/),
[Yale OCS](https://ocs.yale.edu/%F0%9F%93%84-your-academic-cv/).

Guides that **do** say PDF:

- [Georgetown Cawley Career Center](https://careercenter.georgetown.edu/major-career-guides/resumes-cover-letters/curriculum-vitae-cv/):
  > "If you are sending a document over email, send it as a PDF unless otherwise instructed by the employer."
- [Oxford Careers Service](https://www.careers.ox.ac.uk/cvs):
  > "Save your CV as a PDF to ensure it keeps its beautiful formatting"

  (Caveat: in UK usage "CV" means what the US calls a résumé, so this is not
  purely academic-CV advice.)

One guide gives actively *contrary*, dated advice —
[Cornell](https://gradschool.cornell.edu/career-and-professional-development/pathways-to-success/prepare-for-your-career/take-action/resumes-and-cvs/)
suggests you may "cut and paste the CV into the text of the email message" and
"avoid using bold, italics, underlining, lines, or graphics," which is legacy
plain-text-email guidance.

**Conclusion:** PDF is the norm, evidenced far better by 7-of-8 observed CV links
than by the advice literature. Also note that every one of these guides is about
*submitting an application*, not about *what to put on a personal website* — no
authoritative source addresses the website-CV-link question directly. That is a
real gap, and the observable §4a/§4b evidence is the best available substitute.

### 4d. Is an academic CV expected to be ATS-parseable?

**No. ATS keyword screening is an industry hiring concern, not an academic one** —
and the evidence for this is unusually clean.

- The [Harvard GSAS 2025 CV guide](https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2025/08/gsas-cvs-and-cover-letters-2025.pdf)
  contains **zero** occurrences of `applicant tracking`, `ATS`, or `keyword`.
  Georgetown likewise never mentions ATS.
- **[Interfolio Faculty Search](https://www.interfolio.com/products/faculty-search/)**
  (700+ institutions) is a human-review workflow. Interfolio's own
  [document reader help](https://product-help.interfolio.com/evaluating-applications/read-and-evaluate-applications-using-the-document-reader):
  > "Evaluators can highlight and annotate documents, leave comments, apply labels, download materials, and assign ratings all within the reader."

  There is **no mention of automated parsing or scoring**. Princeton's
  [institutional Interfolio guide](https://interfolio.princeton.edu/sites/g/files/toruqf5586/files/documents/Interfolio%20Academic%20Search%20Comprehensive%20Guide.pdf)
  likewise describes only download and annotation workflows.
- **[AcademicJobsOnline](https://academicjobsonline.org/ajo/intro)**: applicants
  "upload any number of files to their own private portfolio"; employers "review
  all application materials" with "full application download as PDF or Zip
  files." Store-and-serve, with rating and shortlisting done by people.

**But the question does not fully disappear for *this* site.** The map's
governing constraint is that this is "an engineer with a real research record,
not a professor," 22 projects to 3 publications. A CV here will be read by
industry recruiters at least as often as by search committees, and industry
pipelines genuinely do parse. The citable source for the failure mode is a
parsing-engine vendor rather than an ATS vendor —
[Affinda](https://www.affinda.com/blog/ocr-resume-scanning/):

> "many still upload scanned PDFs, screenshots or even photos of their CVs.
> **Without OCR, those files are just images – unreadable to your applicant
> tracking system or job board.**"

So the honest framing: **ATS-parseability is not an academic requirement, but the
property it depends on — a real text layer — is required for several other
reasons anyway, and costs nothing to satisfy.** Which resolves it, because:

### 4e. The text layer is needed regardless of ATS — and HTML-first is policy

Independent of any hiring system, a text-layer PDF is what lets a reader copy a
citation or an email address, ctrl-F for a keyword, have the document read by a
screen reader, and have it indexed by search engines and Google Scholar.

Two authoritative sources say this in so many words, and both are directly on
point for a CV published on an academic website.

**Google Scholar's own inclusion guidelines**
([scholar.google.com](https://scholar.google.com/intl/en/scholar/inclusion.html)):

> "Your files need to be either in the HTML or in the PDF format. **PDF files
> must have searchable text, i.e., you must be able to search for and find words
> in the document using Adobe Acrobat Reader.** Each file must not exceed 5MB in
> size. To index larger files, **or to index scanned images of pages that require
> OCR**, please upload them to Google Book Search."

A raster PDF fails this outright, and there is no "Scholar will OCR it" fallback
— Scholar explicitly punts those to Book Search.

**W3C, WCAG technique PDF7**
([www.w3.org/TR/WCAG20-TECHS/PDF7.html](https://www.w3.org/TR/WCAG20-TECHS/PDF7.html)):

> "A document that consists of scanned images of text is **inherently
> inaccessible** because the content of the document is images, not searchable
> text."

> "Assistive technologies cannot read or extract the words; users cannot select,
> edit, resize, or reflow text nor can they change text and background colors."

The mechanical fact underneath both, verified at byte level in §1g: the raster
PDF's page content stream contains **zero text-showing operators**, so *any*
extractor — `pdftotext`, PDF.js `getTextContent`, Apache Tika, Adobe's extraction
API, the substrate every résumé parser is built on — returns an empty string.

Beyond those two, [Section508.gov](https://www.section508.gov/create/pdfs/),
the US federal accessibility authority — and notably it argues **for HTML first**:

> "PDFs are still used across government, but they are often not the most
> accessible or mobile-friendly option. **Federal policy requires agencies to
> prioritize HTML and use PDFs only when necessary.** Choose formats that support
> accessibility, responsiveness, mobile-friendliness, and a digital-first user
> experience."

That is the clearest external endorsement of the recommended shape: **an HTML CV
page as the primary artifact, with a PDF as the downloadable secondary** — the
al-folio pattern, and precisely what §Recommendation proposes.

Every one of these properties fails for the raster PDF measured in §1g, and every
one succeeds for the print-to-PDF measured in §3a. **This single property — does
the output contain text — separates the options more cleanly than any other
criterion,** and it does not depend on resolving the academic-vs-industry
question at all.

### 4f. Claims deliberately NOT relied on

Flagged because they circulate widely and are wrong or unverified:

- **"Greenhouse cannot parse image-only PDFs."** Greenhouse's
  [own supported-formats doc](https://support.greenhouse.io/hc/en-us/articles/360052218132-Supported-formats-for-resumes-cover-letters-and-other-candidate-uploads)
  lists `.doc, .docx, .pdf, .rtf, .txt` and a 100 MB cap, and says **nothing**
  about image-only PDFs or parse failure. The claim traces to SEO content farms.
  Affinda (above) is the defensible citation instead.
- **"Interfolio lets committees full-text-search PDFs."** Could not be confirmed
  against Interfolio's own documentation. If true it would be a text-layer
  argument, not an ATS one — so it would strengthen the recommendation, but it is
  not being counted.
- **"Academic CVs get routed into Workday/PeopleSoft and parsed."** No primary
  support found.
- No first-party Workday or Lever documentation on PDF text-layer requirements
  could be found; every result was SEO blogspam.

---

## 5. Head-to-head summary

| | Print stylesheet + Save as PDF | Static PDF in `public/` | jsPDF + html2canvas |
| --- | --- | --- | --- |
| Shipped JS added | **0 B** | **0 B** | ~182 KB gzip (~82× current total) |
| Output size (measured, ~6pp) | **42 KB** | authored | 610 KB (PNG) / 952 KB (JPEG q1.0, the default) |
| Selectable text | **yes** | yes | **no** |
| Working hyperlinks | **yes** | yes | **no** |
| Embedded fonts | yes | yes | no |
| Screen-reader / Scholar / ATS legible | **yes** | yes | **no** |
| Tagged PDF (structure, outline, `alt`, `lang`) | **yes** (Chrome 85+) | depends on producer | **no** |
| Works with this site's `color-mix()` palette | **yes** | n/a | **throws at ≤390px viewports** |
| Indexable by Google Scholar | **yes** | yes | **no** — "must have searchable text" |
| Identical for every reader | no (Safari unverified) | **yes** | no |
| Page numbers in the artifact | Chrome only | **yes** | no |
| Drift risk | **none** | some (mitigated: printed from the page) | none |
| Dependency health | n/a | n/a | jsPDF healthy; **html2canvas last released 2022-01-22, 974 open issues**, README: "very experimental… I don't recommend using it in a production environment" |

The zero-dependency options win on every axis except "identical for every reader"
and "page numbers" — which are exactly the two axes the committed static PDF
covers. **Combining options 2 and 3 leaves no residual weakness; there is no
trade being made.**

---

## 6. What this implies for implementation (not decided here)

Scoped deliberately to mechanism, per the ticket:

1. Remove `jspdf`, `html2canvas` and `@types/jspdf` from `package.json`.
2. Add `/cv` as a normal Astro page reading from `src/constants/*.constant.ts`.
3. **Lay it out in plain block flow, not grid and not tables** — this is a
   hard constraint from §3d, not a stylistic preference, because Firefox
   fragments grid at 37% and tables at 28%.
4. Add a `@media print` block — the override table is in §3i. Notable traps:
   use `display: none` not `visibility: hidden` (§3a); put `break-inside: avoid`
   on entry *containers* rather than `break-after: avoid` on headings (§3d).
5. Use semantic HTML throughout — it becomes the PDF's structure tags and
   bookmark outline for free (§3b).
6. Add `public/cv.pdf`, produced by printing `/cv` from Chrome, and link it as
   "Download PDF".
7. Record somewhere durable that `cv.pdf` is regenerated whenever the CV
   constants change — the one manual step in the whole scheme.

Open question for the map, from §4a: 71% of comparable researchers link no CV at
all and let publications carry the load. Whether `/cv` earns a nav slot is an IA
question for ticket 03, not this one.

---

## Method note

Facts in §1c, §1d, §1g, §1h, §2 and §3 were **measured**, not read about. Probe
pages were driven in headless Chrome 151 via Playwright; §1d additionally ran
html2canvas against this repo's real built pages served over HTTP at four
viewport widths. PDFs were generated through Chromium's print pipeline and
through jsPDF, then analysed with `pdftotext` and by direct inspection of the PDF
object structure (counting `Tj` text operators, `/Subtype /Link` annotations,
image XObjects and embedded font programs). Bundle sizes are `gzip -9` over the
actual files in this repo's `node_modules`, cross-checked against Bundlephobia's
`?force=true` API. Cross-browser claims in §3d use MDN browser-compat-data and
live web-platform-tests runs (Chrome 152 / Firefox 154 / Safari 26.6) rather than
my own single-browser probe.

Probe files were written to a scratch directory outside the repo. **Nothing under
`src/` was read-modified or written**, per the ticket.

Two caveats on my own numbers:

- `astro build` currently fails on `master` for an unrelated reason —
  `sectionHue` is imported by `src/components/FormalNavbar.astro:2` but not
  exported from `src/utils/hue.ts` (in-flight work from another ticket).
  Shipped-JS figures in §2 were therefore measured from source rather than from
  a fresh `dist/`; §1d used a pre-existing `dist/`.
- Bundlephobia's *cached* (non-`force`) API returns nonsense gzip figures for
  these packages (`html2canvas` → 303 B). Do not quote them.

Deliberately **not** claimed, having been searched for and not found: html2canvas
behaviour for `position: sticky`, CSS Grid, or `@font-face` web fonts (no doc
statement or canonical issue exists — grid is merely absent from the supported
list); the behaviour of viewport units, `position: fixed`/`sticky` and multicol in
paged media; Safari's print-to-PDF link-annotation behaviour; and any first-party
ATS-vendor statement about image-only PDFs. See §3i, §3j and §4f.

## Sources

**html2canvas / jsPDF**
- [niklasvh/html2canvas](https://github.com/niklasvh/html2canvas) — README status quote, 974 open issues, 77 open PRs
- [html2canvas FAQ](https://github.com/niklasvh/html2canvas/blob/master/docs/faq.md) — "will never have full CSS support"; canvas size ceilings
- [html2canvas features doc](https://github.com/niklasvh/html2canvas/blob/master/docs/features.md) — supported / explicitly unsupported property lists
- [html2canvas `src/css/types/color.ts`](https://github.com/niklasvh/html2canvas/blob/master/src/css/types/color.ts) — the 4-entry `SUPPORTED_COLOR_FUNCTIONS` allow-list
- [npm registry: html2canvas](https://registry.npmjs.org/html2canvas) — 1.4.1 published 2022-01-22
- Colour-function issues: [#2700](https://github.com/niklasvh/html2canvas/issues/2700), [#3269](https://github.com/niklasvh/html2canvas/issues/3269), [#3235](https://github.com/niklasvh/html2canvas/issues/3235), [#3204](https://github.com/niklasvh/html2canvas/issues/3204), [#3150](https://github.com/niklasvh/html2canvas/issues/3150), [#3148](https://github.com/niklasvh/html2canvas/issues/3148), [#3272](https://github.com/niklasvh/html2canvas/issues/3272), [#3278](https://github.com/niklasvh/html2canvas/issues/3278); unmerged fixes [PR #3236](https://github.com/niklasvh/html2canvas/pull/3236), [PR #3256](https://github.com/niklasvh/html2canvas/pull/3256)
- [yorickshan/html2canvas-pro](https://github.com/yorickshan/html2canvas-pro) — maintained fork, modern colour function support
- jsPDF: [`addimage.js`](https://github.com/parallax/jsPDF/blob/master/src/modules/addimage.js) (hardcoded `toDataURL(mimeType, 1.0)` for canvas elements), [`html.js`](https://github.com/parallax/jsPDF/blob/master/src/modules/html.js) (`toCanvas` branch commented out; truetype-only `fontFaces`), [README optional dependencies](https://github.com/parallax/jsPDF/blob/master/README.md), [npm registry](https://registry.npmjs.org/jspdf)
- jsPDF output-size reports: [#3178](https://github.com/parallax/jsPDF/issues/3178), [#2885](https://github.com/parallax/jsPDF/issues/2885)
- Local: `node_modules/html2canvas/dist/html2canvas.js:1724-1726,1837-1842`; `node_modules/jspdf/package.json` (`optionalDependencies.html2canvas`); `node_modules/@types/jspdf/package.json`

**Text-layer requirements**
- [Google Scholar inclusion guidelines](https://scholar.google.com/intl/en/scholar/inclusion.html) — "PDF files must have searchable text"
- [W3C WCAG technique PDF7](https://www.w3.org/TR/WCAG20-TECHS/PDF7.html) — scanned-image PDFs "inherently inaccessible"

**CSS print — specs and references**
- [MDN: Printing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing)
- [MDN: Paged media guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Paged_media)
- [MDN: `@page`](https://developer.mozilla.org/en-US/docs/Web/CSS/@page) — implemented descriptors; unsupported page properties
- [MDN: `break-inside`](https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside) — Baseline widely available since January 2019
- [MDN: `print-color-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust) — `economy` default; no guarantee; body-background note
- [MDN: `attr()`](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) · [MDN: `Window.print()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print)
- [W3C CSS Paged Media Level 3](https://www.w3.org/TR/css-page-3/) · [W3C CSS Fragmentation Level 3](https://www.w3.org/TR/css-break-3/)
- [MDN browser-compat-data (CSS)](https://github.com/mdn/browser-compat-data/tree/main/css) — `break-before`, `break-inside`, `page-break-inside`, `orphans`, `widows`, `print-color-adjust`, `@page`, `attr`
- [wpt.fyi](https://wpt.fyi/) — `/css/css-break/`, `/css/css-page/` pass rates, Chrome 152 / Firefox 154 / Safari 26.6

**CSS print — engine sources and bugs**
- Chromium: [`local_frame_view.cc`](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/frame/local_frame_view.cc), [`object_painter.cc`](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/paint/object_painter.cc), [`paint_flags.h`](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/paint/paint_flags.h), [`skia_paint_canvas.cc`](https://source.chromium.org/chromium/chromium/src/+/main:cc/paint/skia_paint_canvas.cc), [`metafile_skia.cc`](https://source.chromium.org/chromium/chromium/src/+/main:printing/metafile_skia.cc)
- Skia: [`SkPDFDocument.h`](https://github.com/google/skia/blob/main/include/docs/SkPDFDocument.h), [`SkAnnotation.h`](https://github.com/google/skia/blob/main/include/core/SkAnnotation.h)
- [Chrome: print margin boxes, Chrome 131](https://developer.chrome.com/blog/print-margins)
- [Chrome: RenderingNG block fragmentation](https://developer.chrome.com/docs/chromium/renderingng-fragmentation) — flex/grid fragmentation in Chrome 103, printing in 108
- [Chromium Blog: generating accessible PDFs](https://blog.chromium.org/2020/07/using-chrome-to-generate-more.html)
- Gecko: [`StaticPrefList.yaml`](https://github.com/mozilla/gecko-dev/blob/master/modules/libpref/init/StaticPrefList.yaml) — `print.save_as_pdf.*` defaults
- Bugs: [Firefox 1972340](https://bugzilla.mozilla.org/show_bug.cgi?id=1972340) (`break-*: avoid` unimplemented), [WebKit 294559](https://bugs.webkit.org/show_bug.cgi?id=294559) (same), [Firefox 454059](https://bugzilla.mozilla.org/show_bug.cgi?id=454059) (PDF hyperlinks), [Firefox 1266265](https://bugzilla.mozilla.org/show_bug.cgi?id=1266265) (grid fragmentation), [Firefox 137367](https://bugzilla.mozilla.org/show_bug.cgi?id=137367) (widows/orphans), [rachelandrew/gridbugs #3](https://github.com/rachelandrew/gridbugs)
- [WebKit Features in Safari 18.2](https://webkit.org/blog/16301/webkit-features-in-safari-18-2/) — refutes the "Safari shipped margin boxes" claim
- [Smashing: The State Of Print Stylesheets In 2018](https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/)

**Academic convention**
- [academicpages](https://github.com/academicpages/academicpages.github.io) + [live CV page](https://academicpages.github.io/cv/) — HTML-only
- [al-folio](https://github.com/alshedivat/al-folio) + [live CV page](https://alshedivat.github.io/al-folio/cv/) — structured source → HTML + static `cv_pdf`
- [AcademicJobsOnline intro](https://academicjobsonline.org/ajo/intro)
- [Interfolio Faculty Search](https://www.interfolio.com/products/faculty-search/) + [document reader help](https://product-help.interfolio.com/evaluating-applications/read-and-evaluate-applications-using-the-document-reader) + [Princeton institutional guide](https://interfolio.princeton.edu/sites/g/files/toruqf5586/files/documents/Interfolio%20Academic%20Search%20Comprehensive%20Guide.pdf)
- [Section508.gov: PDFs](https://www.section508.gov/create/pdfs/) — HTML-first federal policy
- [Affinda: OCR resume scanning](https://www.affinda.com/blog/ocr-resume-scanning/) — image-PDF parse failure
- [Greenhouse: supported upload formats](https://support.greenhouse.io/hc/en-us/articles/360052218132-Supported-formats-for-resumes-cover-letters-and-other-candidate-uploads) — cited to *refute* a common claim
- Career guidance saying PDF: [Georgetown](https://careercenter.georgetown.edu/major-career-guides/resumes-cover-letters/curriculum-vitae-cv/), [Oxford](https://www.careers.ox.ac.uk/cvs)
- Career guidance silent on format: [Harvard GSAS 2025](https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2025/08/gsas-cvs-and-cover-letters-2025.pdf), [Purdue OWL](https://owl.purdue.edu/owl/job_search_writing/resumes_and_vitas/writing_the_cv.html), [UNC](https://writingcenter.unc.edu/tips-and-tools/curricula-vitae-cvs-versus-resumes/), [UPenn](https://careerservices.upenn.edu/application-materials-for-the-faculty-job-search/cvs-for-faculty-job-applications/), [UW](https://careers.uw.edu/resources/academic-careers-cvs/), [Yale OCS](https://ocs.yale.edu/%F0%9F%93%84-your-academic-cv/), [Cornell](https://gradschool.cornell.edu/career-and-professional-development/pathways-to-success/prepare-for-your-career/take-action/resumes-and-cvs/)
- Researcher homepages sampled for CV links: 28 sites, listed in §4a
