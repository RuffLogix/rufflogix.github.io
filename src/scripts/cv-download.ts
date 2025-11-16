import { CVPDFGenerator } from "../utils/pdf-generator.ts";
import {
	personalInfo,
	experienceInformation,
	educationalInformation,
	getCVAwards,
	getCVProjects,
	getCVSkills,
} from "../constants/timeline.constant.ts";

export class CVDownloadManager {
	private static instance: CVDownloadManager;

	private constructor() {}

	public static getInstance(): CVDownloadManager {
		if (!CVDownloadManager.instance) {
			CVDownloadManager.instance = new CVDownloadManager();
		}
		return CVDownloadManager.instance;
	}

	public async generateAndDownloadCV(): Promise<void> {
		try {
			// Show loading state
			this.showLoadingState();

			// Create PDF generator
			const pdfGenerator = new CVPDFGenerator();

			// Generate CV with data from constants
			pdfGenerator.generateCV(
				personalInfo,
				experienceInformation,
				educationalInformation,
				getCVProjects(),
				getCVAwards(),
				getCVSkills()
			);

			// Download the PDF
			pdfGenerator.download(`${personalInfo.name}_CV.pdf`);

			// Hide loading state
			this.hideLoadingState();
		} catch (error) {
			console.error("Error generating CV:", error);
			this.showErrorState();
		}
	}

	private showLoadingState(): void {
		const button = document.querySelector("[data-cv-download]") as HTMLElement;
		if (button) {
			button.style.opacity = "0.7";
			button.style.pointerEvents = "none";

			const buttonText = button.querySelector(".cv-button-text");
			if (buttonText) {
				buttonText.textContent = "Generating CV...";
			}
		}
	}

	private hideLoadingState(): void {
		const button = document.querySelector("[data-cv-download]") as HTMLElement;
		if (button) {
			button.style.opacity = "1";
			button.style.pointerEvents = "auto";

			const buttonText = button.querySelector(".cv-button-text");
			if (buttonText) {
				buttonText.textContent = "Download CV";
			}
		}
	}

	private showErrorState(): void {
		const button = document.querySelector("[data-cv-download]") as HTMLElement;
		if (button) {
			button.style.opacity = "1";
			button.style.pointerEvents = "auto";

			const buttonText = button.querySelector(".cv-button-text");
			if (buttonText) {
				buttonText.textContent = "Error - Try Again";
				setTimeout(() => {
					buttonText.textContent = "Download CV";
				}, 3000);
			}
		}
	}

	public initializeDownloadButton(): void {
		const downloadButton = document.querySelector("[data-cv-download]");

		if (downloadButton) {
			downloadButton.addEventListener("click", (e) => {
				e.preventDefault();
				this.generateAndDownloadCV();
			});
		}
	}
}

// Auto-initialize when script loads
if (typeof window !== "undefined") {
	document.addEventListener("DOMContentLoaded", () => {
		const cvManager = CVDownloadManager.getInstance();
		cvManager.initializeDownloadButton();
	});
}
