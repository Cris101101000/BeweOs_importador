import type { BaseAccordionItem } from "@shared/ui/components";
import type { ContentOrigin } from "@shared/features/linda/content-generation";

/**
 * Item de idea del banco de ideas mostrado en el acordeón de la pestaña
 * "Contenido propuesto". Representa el modelo de vista (UI) para una idea.
 */
export interface ProposedContentIdeaItem extends BaseAccordionItem {
	id: string;
	title: string;
	description: string;
	prompt: string;
	channels: string[];
	type: string;
	contentType: string;
	origin?: ContentOrigin;
	score: number;
	status: string;
	priority: number;
	publishDate: Date;
	expiryDate: Date;
	rationale: string;
	scoringBreakdown: Record<string, number>;
}
