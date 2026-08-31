import type { APIRoute } from "astro";
import { publicationInformation } from "../constants/publication.constant";
import { toBibFile } from "../utils/citation";

/** The full publication list as a downloadable .bib file. */
export const GET: APIRoute = () =>
  new Response(toBibFile(publicationInformation), {
    headers: { "Content-Type": "application/x-bibtex; charset=utf-8" },
  });
