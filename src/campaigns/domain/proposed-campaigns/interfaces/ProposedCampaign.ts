import type { EnumCampaignContentType } from "@campaigns/domain/campaign-management/enums/EnumCampaignContentType";

/**
 * Interface para una campaña propuesta por Linda (IA)
 */
export interface IProposedCampaign {
	id: string;
	proposalId: string;
	companyId: string;
	title: string;
	description: string;
	suggestedText: string;
	contentType: EnumCampaignContentType;
	targetAudienceCount: number;
	audienceReason: string;
	requiredTags: string[];
	evaluationScore: number;
	scoringBreakdown: Record<string, number>;
	evaluationRationale: string;
	priority: number;
	suggestedDate: Date;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Respuesta paginada de campañas propuestas
 */
export interface IProposedCampaignsResponse {
	campaigns: IProposedCampaign[];
	total: number;
	limit: number;
	offset: number;
}
