import type { KnowledgeGapType } from "./enums";

// Domain entity
export interface IKnowledgeGap {
	id: string;
	type: KnowledgeGapType;
	question: string;
	suggestedAnswer?: string;
	frequency: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	suggestedName?: string;
	suggestedCategory?: string;
	suggestedPrice?: number;
}

// UI Configuration types
export type GapTypeChipColor =
	| "primary"
	| "success"
	| "warning"
	| "secondary"
	| "default";

export interface GapTypeConfig {
	label: string;
	color: GapTypeChipColor;
	icon: string;
	buttonLabel: string;
	route: string;
}
