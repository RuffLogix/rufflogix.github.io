import type { PublicationInformation } from "../types/publication.d.ts";

/**
 * BibTeX generation for the publications page.
 *
 * Entries are derived from `publication.constant.ts` rather than stored
 * alongside it, so a new publication only has to be described once.
 */

/** Words too generic to make a citation key recognisable. */
const KEY_STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "on",
  "of",
  "for",
  "and",
  "what",
  "will",
  "this",
  "using",
  "with",
  "from",
  "into",
  "its",
]);

function year(date: string): string {
  return date.match(/\d{4}/)?.[0] ?? "";
}

function lastName(author: string): string {
  const parts = author.trim().split(/\s+/);
  return parts[parts.length - 1] ?? author;
}

/** arXiv identifier, taken from the abs link or the DataCite-style DOI. */
function arxivId(p: PublicationInformation): string | undefined {
  return (
    p.doiLink?.match(/arxiv\.org\/abs\/([\d.]+)/i)?.[1] ??
    p.doi?.match(/arxiv\.([\d.]+)/i)?.[1]
  );
}

/** First arXiv subject class listed in the venue string, e.g. "cs.GR". */
function primaryClass(p: PublicationInformation): string | undefined {
  return p.venue.match(/\b([a-z-]+\.[A-Z]{2})\b/)?.[1];
}

/**
 * Citation key in the usual `authorYearWord` form. Keyed off the first author,
 * not the site owner, so the key matches what co-authors would write.
 */
export function citeKey(p: PublicationInformation): string {
  const first = lastName(p.authors[0] ?? "unknown").toLowerCase();
  const word =
    p.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .find((w) => w.length > 3 && !KEY_STOP_WORDS.has(w)) ?? "untitled";
  return `${first}${year(p.date)}${word}`;
}

type Field = [name: string, value: string | undefined];

function entry(kind: string, key: string, fields: Field[]): string {
  const body = fields
    .filter((f): f is [string, string] => Boolean(f[1]))
    .map(([name, value]) => `  ${name} = {${value}}`)
    .join(",\n");
  return `@${kind}{${key},\n${body}\n}`;
}

export function toBibtex(p: PublicationInformation): string {
  const key = citeKey(p);
  // Braced twice so BibTeX styles keep the title's capitalisation.
  const shared: Field[] = [
    ["title", `{${p.title}}`],
    ["author", p.authors.join(" and ")],
    ["year", year(p.date)],
  ];
  const identifiers: Field[] = [
    ["doi", p.doi],
    ["url", p.doiLink],
  ];

  switch (p.type) {
    case "Preprint": {
      const eprint = arxivId(p);
      return entry("misc", key, [
        ...shared,
        ["eprint", eprint],
        ["archivePrefix", eprint ? "arXiv" : undefined],
        ["primaryClass", primaryClass(p)],
        ...identifiers,
      ]);
    }
    case "Conference Paper":
      return entry("inproceedings", key, [
        ...shared,
        ["booktitle", p.venue],
        ...identifiers,
      ]);
    default:
      return entry("article", key, [
        ...shared,
        ["journal", p.venue],
        ...identifiers,
      ]);
  }
}

/** The whole list as one `.bib` file body. */
export function toBibFile(publications: PublicationInformation[]): string {
  return publications.map(toBibtex).join("\n\n") + "\n";
}
