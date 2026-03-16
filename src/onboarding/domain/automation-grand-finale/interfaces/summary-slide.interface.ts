import type { GrandFinalePhase } from "../enums/grand-finale-phase.enum";

export interface ISummarySlide {
	id: Exclude<GrandFinalePhase, GrandFinalePhase.FINAL>;
	icon: string;
	title: string;
	subtitle: string;
	features: string[];
	lindaSpeech: string;
	gradient: string;
}
