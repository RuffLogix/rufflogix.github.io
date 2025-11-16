export interface ProjectInformation {
	title: string;
	category: string;
	date: string;
	description: string;
	tags: string[];
	role: string;
	image: string;
	infoLink?: string;
	articleLink?: string;
	githubLinks?: { label: string; url: string }[];
}
