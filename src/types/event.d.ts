export type EventType =
	| "Competition"
	| "Camp"
	| "Program"
	| "Hackathon"
	| "Conference";

export interface EventInformation {
	/** Display emoji / medal icon. */
	emoji: string;
	title: string;
	/** Organising body, e.g. "AIAT", "POSN", "iGEM Foundation". Omit for self-hosted events. */
	organization?: string;
	type: EventType;
	/** My role, e.g. "Host", "Organizer". Omit for events I participated in. */
	role?: string;
	/** Result or recognition, e.g. "Silver Medal", "Participant". */
	award?: string;
	description?: string;
	/** Year used for grouping / display. */
	year: string;
	location?: string;
	link?: string;
}
