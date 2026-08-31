export interface PublicationInformation {
	title: string;
	authors: string[];
	/** Index (or indices) of the site owner within the authors array, for highlighting. */
	selfAuthorIndex?: number | number[];
	venue: string;
	date: string;
	type: string;
	/** Research area, used to group entries and build the legend. */
	area?: string;
	abstract?: string;
	tags: string[];
	doi?: string;
	doiLink?: string;
	pdfLink?: string;
}
