export interface CourseworkArea {
	area: string;
	courses: string[];
}

export interface EducationalInformation {
	image: string;
	instituteName: string;
	program: string;
	location: string;
	duration: string;
	calculatedDuration: string;
	description: string;
	coursework?: CourseworkArea[];
}

export interface ExperiencePosition {
	program: string;
	duration: string;
	calculatedDuration: string;
	description: string;
}

export interface ExperienceInformation {
	image: string;
	instituteName: string;
	link?: string;
	program?: string;
	location: string;
	duration: string;
	calculatedDuration: string;
	description?: string;
	positions?: ExperiencePosition[];
}
