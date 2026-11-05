export interface ProjectInformation {
	title: string;
	category: string;
	date: string;
	description: string;
	/** One line for lists and cards, when the description's first sentence won't do. */
	summary?: string;
	tags: string[];
	role: string;
	status?: string;
	image: string;
	infoLink?: string;
	articleLink?: string;
	videoLink?: string;
	githubLinks?: { label: string; url: string }[];
}
