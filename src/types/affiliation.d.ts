export interface AffiliationInformation {
	/** Path under `public/images/affiliations/`. SVG or a transparent PNG. */
	image: string;
	/** Company name, used as the logo's alt text. */
	name: string;
	/** Job title held there — "Backend Engineer". */
	position: string;
	/** Period worked — "2025 – Present", "2024 – 2025". */
	period: string;
	/**
	 * Whether the role is still held. Current roles sort first and carry a live
	 * dot; past roles render dimmed, which is what makes "ex-" legible without
	 * spelling the word out on every card.
	 */
	current?: boolean;
	link?: string;
}
