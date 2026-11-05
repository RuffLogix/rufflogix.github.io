import type { ProjectInformation } from "../types/project.d.ts";

/** Every outbound link for a project, the most direct destination first. */
export function projectLinks(
  p: ProjectInformation,
): { label: string; url: string }[] {
  return [
    ...(p.infoLink ? [{ label: "Live", url: p.infoLink }] : []),
    ...(p.githubLinks ?? []),
    ...(p.articleLink ? [{ label: "Article", url: p.articleLink }] : []),
    ...(p.videoLink ? [{ label: "YouTube", url: p.videoLink }] : []),
  ];
}

/**
 * One line for lists and cards. Uses `summary` when the entry sets one,
 * otherwise the description's first sentence, so a new project only needs a
 * summary if its opening sentence doesn't stand alone.
 */
export function projectSummary(p: ProjectInformation): string {
  if (p.summary) return p.summary;
  return p.description.match(/^.*?[.!?](?=\s+["A-Z]|$)/s)?.[0] ?? p.description;
}

/** "September 2026" becomes "Sep 2026"; a bare year passes through. */
export function projectShortDate(p: ProjectInformation): string {
  return p.date.replace(/^([A-Za-z]{3})[a-z]*/, "$1");
}

export function projectYear(p: ProjectInformation): string {
  return p.date.match(/\d{4}/)?.[0] ?? p.date;
}

/** "September 2026" becomes "Sep"; null when only the year is known. */
export function projectMonth(p: ProjectInformation): string | null {
  return p.date.match(/^[A-Za-z]{3}/)?.[0] ?? null;
}
