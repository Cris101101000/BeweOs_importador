import type { IdeaStatus } from "../enums/idea-status.enum";

/**
 * Interfaz para una idea individual del banco de ideas
 */
export interface IIdea {
	id: string;
	proposalId: string;
	companyId: string;
	companyName: string;
	agencyId: string;
	agencyName: string;
	suggestedTitle: string;
	suggestedDescription: string;
	suggestedPrompt: string;
	suggestedChannels: string[];
	type: string;
	contentType: string;
	evaluationScore: number;
	scoringBreakdown: Record<string, number>;
	evaluationRationale: string;
	priority: number;
	status: IdeaStatus;
	targetPublishDate: Date;
	targetExpiryDate: Date;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Respuesta paginada del banco de ideas
 */
export interface IIdeaBankResponse {
	ideas: IIdea[];
	total: number;
	limit: number;
	offset: number;
}
