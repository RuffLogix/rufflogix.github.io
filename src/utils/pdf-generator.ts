import jsPDF from "jspdf";
import type {
	EducationalInformation,
	ExperienceInformation,
} from "../types/timeline.d.ts";

export interface PersonalInfo {
	name: string;
	title: string;
	email: string;
	phone?: string;
	location: string;
	website?: string;
	linkedin?: string;
	github?: string;
}

export interface ProjectInfo {
	title: string;
	description: string;
	technologies?: string[];
	details?: string[];
}

export interface AwardInfo {
	title: string;
	description: string;
	details?: string[];
}

export class CVPDFGenerator {
	private pdf: jsPDF;
	private pageWidth: number;
	private pageHeight: number;
	private margin: number;
	private currentY: number;
	private contentWidth: number;

	constructor() {
		this.pdf = new jsPDF();
		this.pageWidth = this.pdf.internal.pageSize.getWidth();
		this.pageHeight = this.pdf.internal.pageSize.getHeight();
		this.margin = 25;
		this.currentY = this.margin;
		this.contentWidth = this.pageWidth - this.margin * 2;
	}

	public generateCV(
		personalInfo: PersonalInfo,
		experience: ExperienceInformation[],
		education: EducationalInformation[],
		projects?: ProjectInfo[],
		awards?: AwardInfo[],
		skills?: string[]
	): void {
		// Set default font
		this.pdf.setFont("helvetica");

		// Header with name and contact
		this.addHeader(personalInfo);

		// Education Section (like the reference CV)
		this.addEducationSection(education);

		// Experience Section
		this.addExperienceSection(experience);

		// Awards and Achievements Section
		if (awards && awards.length > 0) {
			this.addAwardsSection(awards);
		}

		// Projects Section
		if (projects && projects.length > 0) {
			this.addProjectsSection(projects);
		}

		// Skills Section
		if (skills && skills.length > 0) {
			this.addSkillsSection(skills);
		}
	}

	private addHeader(personalInfo: PersonalInfo): void {
		// Name - centered and large
		this.pdf.setFontSize(20);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.setTextColor(0, 0, 0);
		const nameWidth = this.pdf.getTextWidth(personalInfo.name);
		const nameX = (this.pageWidth - nameWidth) / 2;
		this.pdf.text(personalInfo.name, nameX, this.currentY);
		this.currentY += 8;

		// Contact info - centered on one line
		this.pdf.setFontSize(11);
		this.pdf.setFont("helvetica", "normal");

		const contactParts = [];
		if (personalInfo.phone) contactParts.push(`Tel: ${personalInfo.phone}`);
		if (personalInfo.email) contactParts.push(personalInfo.email);

		const contactLine = contactParts.join(" | ");
		const contactWidth = this.pdf.getTextWidth(contactLine);
		const contactX = (this.pageWidth - contactWidth) / 2;
		this.pdf.text(contactLine, contactX, this.currentY);
		this.currentY += 10;

		// Bio/Summary paragraph - justified
		if (personalInfo.title) {
			this.pdf.setFontSize(11);
			this.pdf.setFont("helvetica", "normal");
			const bioText = `A junior in Computer Engineering with a strong passion for AI, software development, and the mathematics behind algorithms. These interests drive my eagerness to learn, practice, and deepen my expertise.`;

			const bioLines = this.pdf.splitTextToSize(bioText, this.contentWidth);
			bioLines.forEach((line: string) => {
				this.checkPageBreak(5);
				this.pdf.text(line, this.margin, this.currentY);
				this.currentY += 5;
			});
			this.currentY += 5;
		}
	}

	private addEducationSection(education: EducationalInformation[]): void {
		if (!education || education.length === 0) return;

		this.addSectionHeader("Education");

		education.forEach((edu) => {
			this.checkPageBreak(30);

			// University name and location (right-aligned)
			this.pdf.setFontSize(12);
			this.pdf.setFont("helvetica", "bold");
			this.pdf.setTextColor(0, 0, 0);

			const locationText = edu.location;
			const locationWidth = this.pdf.getTextWidth(locationText);
			this.pdf.text(
				locationText,
				this.pageWidth - this.margin - locationWidth,
				this.currentY
			);
			this.pdf.text(edu.instituteName, this.margin, this.currentY);
			this.currentY += 6;

			// Degree and dates
			this.pdf.setFontSize(11);
			this.pdf.setFont("helvetica", "italic");
			this.pdf.setTextColor(0, 0, 0);

			const dateText = edu.duration;
			const dateWidth = this.pdf.getTextWidth(dateText);
			this.pdf.text(
				dateText,
				this.pageWidth - this.margin - dateWidth,
				this.currentY
			);
			this.pdf.text(edu.program, this.margin, this.currentY);
			this.currentY += 8;

			// Coursework or description
			if (edu.description) {
				this.pdf.setFontSize(11);
				this.pdf.setFont("helvetica", "normal");
				this.pdf.text("•", this.margin + 5, this.currentY);

				const descLines = this.pdf.splitTextToSize(
					`Coursework: ${edu.description}`,
					this.contentWidth - 15
				);

				descLines.forEach((line: string, index: number) => {
					this.pdf.text(line, this.margin + 15, this.currentY);
					if (index < descLines.length - 1) this.currentY += 5;
				});
				this.currentY += 8;
			}
		});
	}

	private addExperienceSection(experience: ExperienceInformation[]): void {
		if (!experience || experience.length === 0) return;

		this.addSectionHeader("Experiences");

		experience.forEach((exp) => {
			this.checkPageBreak(40);

			// Company name and location
			this.pdf.setFontSize(12);
			this.pdf.setFont("helvetica", "bold");
			this.pdf.setTextColor(0, 0, 0);

			const locationText = exp.location;
			const locationWidth = this.pdf.getTextWidth(locationText);
			this.pdf.text(
				locationText,
				this.pageWidth - this.margin - locationWidth,
				this.currentY
			);
			this.pdf.text(exp.instituteName, this.margin, this.currentY);
			this.currentY += 6;

			// Position and dates
			this.pdf.setFontSize(11);
			this.pdf.setFont("helvetica", "italic");

			const dateText = exp.duration;
			const dateWidth = this.pdf.getTextWidth(dateText);
			this.pdf.text(
				dateText,
				this.pageWidth - this.margin - dateWidth,
				this.currentY
			);
			this.pdf.text(exp.program, this.margin, this.currentY);
			this.currentY += 8;

			// Description as bullet point
			if (exp.description) {
				this.pdf.setFontSize(11);
				this.pdf.setFont("helvetica", "normal");
				this.pdf.text("•", this.margin + 5, this.currentY);

				const descLines = this.pdf.splitTextToSize(
					exp.description,
					this.contentWidth - 15
				);

				descLines.forEach((line: string, index: number) => {
					this.pdf.text(line, this.margin + 15, this.currentY);
					if (index < descLines.length - 1) this.currentY += 5;
				});
				this.currentY += 8;
			}
		});
	}

	private addAwardsSection(awards: AwardInfo[]): void {
		if (!awards || awards.length === 0) return;

		this.addSectionHeader("Awards and Achievements");

		awards.forEach((award) => {
			this.checkPageBreak(20);

			// Award title
			this.pdf.setFontSize(12);
			this.pdf.setFont("helvetica", "bold");
			this.pdf.setTextColor(0, 0, 0);
			this.pdf.text(award.title, this.margin, this.currentY);
			this.currentY += 6;

			// Award details as bullet points
			if (award.details) {
				award.details.forEach((detail) => {
					this.pdf.setFontSize(11);
					this.pdf.setFont("helvetica", "normal");
					this.pdf.text("•", this.margin + 5, this.currentY);

					const detailLines = this.pdf.splitTextToSize(
						detail,
						this.contentWidth - 15
					);
					detailLines.forEach((line: string, index: number) => {
						this.pdf.text(line, this.margin + 15, this.currentY);
						if (index < detailLines.length - 1) this.currentY += 5;
					});
					this.currentY += 5;
				});
			}
			this.currentY += 3;
		});
	}

	private addProjectsSection(projects: ProjectInfo[]): void {
		if (!projects || projects.length === 0) return;

		this.addSectionHeader("Projects");

		projects.forEach((project) => {
			this.checkPageBreak(25);

			// Project title
			this.pdf.setFontSize(12);
			this.pdf.setFont("helvetica", "bold");
			this.pdf.setTextColor(0, 0, 0);
			this.pdf.text(project.title, this.margin, this.currentY);
			this.currentY += 6;

			// Project details as bullet points
			if (project.details) {
				project.details.forEach((detail) => {
					this.pdf.setFontSize(11);
					this.pdf.setFont("helvetica", "normal");
					this.pdf.text("•", this.margin + 5, this.currentY);

					const detailLines = this.pdf.splitTextToSize(
						detail,
						this.contentWidth - 15
					);
					detailLines.forEach((line: string, index: number) => {
						this.pdf.text(line, this.margin + 15, this.currentY);
						if (index < detailLines.length - 1) this.currentY += 5;
					});
					this.currentY += 5;
				});
			}
			this.currentY += 3;
		});
	}

	private addSkillsSection(skills: string[]): void {
		if (!skills || skills.length === 0) return;

		this.addSectionHeader("Skills");

		this.pdf.setFontSize(11);
		this.pdf.setFont("helvetica", "normal");
		this.pdf.setTextColor(0, 0, 0);

		const skillsText = skills.join(", ");
		const skillsLines = this.pdf.splitTextToSize(skillsText, this.contentWidth);

		skillsLines.forEach((line: string) => {
			this.checkPageBreak(5);
			this.pdf.text(line, this.margin, this.currentY);
			this.currentY += 5;
		});
	}

	private addSectionHeader(title: string): void {
		this.checkPageBreak(15);

		// Section title - centered and underlined
		this.pdf.setFontSize(14);
		this.pdf.setFont("helvetica", "bold");
		this.pdf.setTextColor(0, 0, 0);

		const titleWidth = this.pdf.getTextWidth(title);
		const titleX = (this.pageWidth - titleWidth) / 2;
		this.pdf.text(title, titleX, this.currentY);

		// Underline
		const underlineY = this.currentY + 1;
		this.pdf.setDrawColor(0, 0, 0);
		this.pdf.setLineWidth(0.5);
		this.pdf.line(
			this.margin,
			underlineY,
			this.pageWidth - this.margin,
			underlineY
		);

		this.currentY += 10;
	}

	private addFooter(): void {
		const footerY = this.pageHeight - 15;
		this.pdf.setFontSize(8);
		this.pdf.setTextColor(150, 150, 150);
		this.pdf.text(
			`Generated on ${new Date().toLocaleDateString()}`,
			this.margin,
			footerY
		);
	}

	private checkPageBreak(requiredSpace: number): void {
		if (this.currentY + requiredSpace > this.pageHeight - 30) {
			this.pdf.addPage();
			this.currentY = this.margin;
		}
	}

	public download(filename: string = "CV.pdf"): void {
		this.pdf.save(filename);
	}

	public getBlob(): Blob {
		return this.pdf.output("blob");
	}
}
