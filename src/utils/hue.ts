/**
 * Agoji hue system.
 *
 * The five colours are lifted from the five dots in the Agoda logo — the ones
 * the Agoji mascots grew out of. Here they act as a *categorical* scale: a
 * given category, publication type, event type or organisation always resolves
 * to the same hue, so colour becomes wayfinding rather than decoration.
 *
 * Consumers set `data-hue="<name>"` on a container; `formal.css` maps that to
 * the `--hue` custom property, which every descendant reads. Contrast for each
 * hue is tuned per theme in `formal.css` — see the token block there.
 */

export const HUES = ["blue", "green", "orange", "purple", "red"] as const;
export type Hue = (typeof HUES)[number];

/** Stable fallback so an unmapped value still gets a consistent colour. */
function hashHue(key: string): Hue {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return HUES[h % HUES.length];
}

const lookup =
  <K extends string>(map: Record<K, Hue>) =>
  (key: string | undefined): Hue =>
    key ? ((map as Record<string, Hue>)[key] ?? hashHue(key)) : "blue";

/**
 * Project categories, grouped by family so related work shares a colour:
 * blue = product surfaces, green = intelligence, purple = data/research,
 * orange = tooling & hardware, red = play.
 */
export const projectHue = lookup({
  "Web Development": "blue",
  "Full Stack": "blue",
  "Mobile App": "blue",
  "AI / Machine Learning": "green",
  "AI / Chatbot": "green",
  "Data Science": "purple",
  "Developer Tool": "orange",
  "IoT Project": "orange",
  "Game Development": "red",
});

export const publicationHue = lookup({
  "Journal Article": "purple",
  "Conference Paper": "blue",
  Preprint: "green",
});

export const eventHue = lookup({
  Competition: "red",
  Hackathon: "orange",
  Camp: "green",
  Program: "purple",
});

/** Organisations on the About timeline — nods to each brand where one exists. */
export const orgHue = lookup({
  Agoda: "blue",
  "Kasikorn Business-Technology Group (KBTG)": "green",
  "LINE MAN Wongnai": "red",
  "Looloo Technology": "purple",
  "Khui AI": "orange",
  AIMET: "blue",
  "Chulalongkorn University": "red",
  "Benjamarachutit School": "orange",
});

export const skillHue = lookup({
  "Programming Languages": "blue",
  "Web Technologies": "orange",
  "Machine Learning & AI": "green",
  "Cloud & DevOps": "purple",
  "Mobile Development": "red",
  "Databases & Tools": "blue",
});

/** Per-section hue used by the navbar underline and the logo dot. */
export const SECTION_HUE: Record<string, Hue> = {
  "/": "blue",
  "/projects": "orange",
  "/publications": "purple",
  "/events": "red",
  "/about": "green",
  "/articles": "blue",
};

export function sectionHue(pathname: string): Hue {
  const match = Object.keys(SECTION_HUE)
    .filter((href) => href !== "/" && pathname.startsWith(href))
    .sort((a, b) => b.length - a.length)[0];
  return SECTION_HUE[match ?? "/"];
}
