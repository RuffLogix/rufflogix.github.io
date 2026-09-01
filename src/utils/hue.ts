/**
 * The research / engineering axis.
 *
 * This site carries exactly two hues, and they encode one thing: which of the
 * two practices a piece of work belongs to. Amber is research — paper, archive,
 * citation. Slate-blue is engineering — machine, code, runtime.
 *
 * The axis is applied only where it is *real*. Events, technical skills and tags
 * do not belong to one practice or the other, so they carry no hue at all, and
 * that absence is meaningful rather than an oversight: unhued things render in
 * ink. This is why `--accent` is a near-ink neutral and not a colour — if the
 * neutral were tinted, "no practice" and "engineering" would look the same.
 *
 * Where something could be read either way, the *artifact* decides, not the
 * topic: a DOI makes it research.
 *
 * Consumers set `data-hue="research" | "engineering"` on a container;
 * `formal.css` maps that to the `--hue` custom property, which every descendant
 * reads. A consumer that resolves to `undefined` simply omits the attribute and
 * inherits ink. Contrast for each hue is tuned per theme in `formal.css`.
 */

export const HUES = ["research", "engineering"] as const;
export type Hue = (typeof HUES)[number];

/**
 * Project categories. Six of the twenty-two projects are research-flavoured;
 * the rest are things that shipped. The split is what makes the colour worth
 * spending — a single-hue index would carry no information.
 */
const PROJECT_RESEARCH_CATEGORIES = new Set([
  "AI / Machine Learning",
  "Data Science",
]);

export function projectHue(category: string | undefined): Hue {
  return category && PROJECT_RESEARCH_CATEGORIES.has(category)
    ? "research"
    : "engineering";
}

/**
 * Organisations on the About timeline, hued by the kind of work done there
 * rather than by what the organisation is. Anything absent from this map — a
 * secondary school, say — is neither practice and correctly renders in ink.
 */
const ORG_HUES: Record<string, Hue> = {
  "Chulalongkorn University": "research",
  AIMET: "research",
  Agoda: "engineering",
  "Kasikorn Business-Technology Group (KBTG)": "engineering",
  "LINE MAN Wongnai": "engineering",
  "Looloo Technology": "engineering",
  "Khui AI": "engineering",
};

export function orgHue(instituteName: string | undefined): Hue | undefined {
  return instituteName ? ORG_HUES[instituteName] : undefined;
}
