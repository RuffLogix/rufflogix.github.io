const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
};

/**
 * Decode HTML entities in text pulled from the Medium RSS feed.
 *
 * The feed hands back titles that are already escaped ("Transcription &amp;
 * Translation"). Astro escapes again on render, so the ampersand reaches the
 * page as literal `&amp;` unless it is decoded here first.
 */
export function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const code =
        body[1] === "x" || body[1] === "X"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

/**
 * Replace em dashes with ordinary punctuation.
 *
 * The site's own copy is written without them, but Medium titles and excerpts
 * arrive as whatever was typed there, so feed text is normalised on the way in.
 * A dash flanked by spaces becomes a comma; one set tight against the words it
 * joins is doing the work of a hyphen, so it becomes one.
 */
export function stripEmDashes(text: string): string {
  return text.replace(/\s+—\s+/g, ", ").replace(/—/g, "-");
}
