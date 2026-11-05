import { decodeEntities, stripEmDashes } from "./html.ts";

export const MEDIUM_PROFILE = "https://medium.com/@rufflogix";

const FEED_URL = "https://medium.com/feed/@rufflogix";
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${FEED_URL}`;

export interface MediumPost {
  title: string;
  pubDate: string;
  url: string;
  /** Raw HTML from the feed; pass through `postExcerpt` before rendering. */
  html: string;
  image: string | null;
}

function tag(xml: string, name: string): string {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return (match?.[1] ?? "").replace(/^<!\[CDATA\[|\]\]>$/g, "").trim();
}

function firstImage(html: string): string | null {
  return html.match(/<img[^>]+src="([^"]+)"/)?.[1] ?? null;
}

function parseFeed(xml: string): MediumPost[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const html = tag(item, "content:encoded") || tag(item, "description");
    return {
      title: tag(item, "title"),
      pubDate: tag(item, "pubDate"),
      url: tag(item, "link").split("?")[0],
      html,
      image: firstImage(html),
    };
  });
}

async function fromFeed(): Promise<MediumPost[]> {
  const r = await fetch(FEED_URL, {
    headers: { "User-Agent": "Mozilla/5.0 rufflogix.github.io build" },
  });
  return r.ok ? parseFeed(await r.text()) : [];
}

async function fromRss2Json(): Promise<MediumPost[]> {
  const r = await fetch(RSS2JSON_URL);
  if (!r.ok) return [];
  const d = await r.json();
  return (d.items ?? []).map(
    (i: { title: string; pubDate: string; link: string; description: string; content?: string; thumbnail?: string }) => ({
      title: i.title,
      pubDate: i.pubDate,
      url: i.link.split("?")[0],
      html: i.content || i.description,
      image: i.thumbnail || firstImage(i.content || i.description),
    }),
  );
}

let cached: Promise<MediumPost[]> | undefined;

/**
 * Posts for the build. Reads Medium's feed directly and falls back to rss2json,
 * whose shared rate limit otherwise empties the Writing page at random. Cached
 * so the homepage and /articles share one fetch.
 */
export function getPosts(): Promise<MediumPost[]> {
  cached ??= (async () => {
    for (const source of [fromFeed, fromRss2Json]) {
      try {
        const posts = await source();
        if (posts.length > 0) return posts;
      } catch {
        /* try the next source */
      }
    }
    return [];
  })();
  return cached;
}

export function postTitle(post: MediumPost): string {
  return stripEmDashes(decodeEntities(post.title));
}

export function postExcerpt(post: MediumPost, max: number): string {
  const text = stripEmDashes(decodeEntities(post.html.replace(/<[^>]*>/g, " ")))
    .replace(/Continue reading on Medium\s*»/, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function postDate(post: MediumPost): string {
  return new Date(post.pubDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
