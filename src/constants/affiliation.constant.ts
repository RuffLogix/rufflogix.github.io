import type { AffiliationInformation } from "../types/affiliation.d.ts";
import { experienceInformation } from "./timeline.constant";

/**
 * Part-time roles shown as a logo strip, derived from the About timeline rather
 * than hand-listed beside it.
 *
 * A role qualifies by having "(Part-time)" in its title — the same string the
 * timeline already renders — so adding a part-time job to `timeline.constant.ts`
 * puts it in the strip automatically, and the two can never disagree. Companies
 * where only some of the roles were part-time (Khui AI, Looloo) contribute just
 * the part-time position, not the whole tenure.
 *
 * Logos are the timeline's own, under `public/images/experience/`. They render
 * on a chip, so a logo with a baked-in white background is fine here.
 */
const PART_TIME = /\s*\(part-time\)\s*/i;

export const affiliationInformation: AffiliationInformation[] =
	experienceInformation.flatMap((exp) => {
		// Multi-position companies carry the title on each position; single-role
		// ones carry it on the entry itself.
		const roles = exp.positions
			? exp.positions.map((p) => ({
					program: p.program,
					duration: p.duration,
				}))
			: exp.program
				? [{ program: exp.program, duration: exp.duration }]
				: [];

		return roles
			.filter((role) => PART_TIME.test(role.program))
			.map((role) => ({
				image: exp.image,
				name: exp.instituteName,
				// The strip is entirely part-time roles, so repeating the suffix on
				// every card would say nothing.
				position: role.program.replace(PART_TIME, "").trim(),
				period: role.duration,
				current: /present/i.test(role.duration),
				link: exp.link,
			}));
	});
