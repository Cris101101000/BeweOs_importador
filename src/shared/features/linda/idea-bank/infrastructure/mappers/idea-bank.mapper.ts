import { IdeaStatus } from "../../domain/enums/idea-status.enum";
import type {
	IIdea,
	IIdeaBankResponse,
} from "../../domain/interfaces/idea-bank.interface";
import type { GetIdeaBankResponseDto, IdeaDto } from "../dtos/idea-bank.dto";

/**
 * Mapea el estado de la API al enum del dominio
 */
function mapIdeaStatus(status: string): IdeaStatus {
	const statusMap: Record<string, IdeaStatus> = {
		pending: IdeaStatus.PENDING,
		under_review: IdeaStatus.UNDER_REVIEW,
		approved: IdeaStatus.APPROVED,
		rejected: IdeaStatus.REJECTED,
		expired: IdeaStatus.EXPIRED,
	};

	return statusMap[status] || IdeaStatus.PENDING;
}

/**
 * Parsea el scoring breakdown de string JSON a objeto
 */
function parseScoringBreakdown(
	scoringBreakdown: string
): Record<string, number> {
	try {
		return JSON.parse(scoringBreakdown);
	} catch {
		return {};
	}
}

/**
 * Mapea un DTO de idea a la interfaz del dominio
 */
export function toIdeaFromDto(dto: IdeaDto): IIdea {
	return {
		id: dto.id,
		proposalId: dto.proposal_id,
		companyId: dto.company_id,
		companyName: dto.company_name,
		agencyId: dto.agency_id,
		agencyName: dto.agency_name,
		suggestedTitle: dto.suggested_title,
		suggestedDescription: dto.suggested_description,
		suggestedPrompt: dto.suggested_prompt,
		suggestedChannels: dto.suggested_channels,
		type: dto.type,
		contentType: dto.content_type,
		evaluationScore: dto.evaluation_score,
		scoringBreakdown: parseScoringBreakdown(dto.scoring_breakdown),
		evaluationRationale: dto.evaluation_rationale,
		priority: dto.priority,
		status: mapIdeaStatus(dto.status),
		targetPublishDate: new Date(dto.target_publish_date),
		targetExpiryDate: new Date(dto.target_expiry_date),
		expiresAt: new Date(dto.expires_at),
		createdAt: new Date(dto.created_at),
		updatedAt: new Date(dto.updated_at),
	};
}

/**
 * Mapea la respuesta DTO del banco de ideas a la interfaz del dominio
 */
export function toIdeaBankResponseFromDto(
	dto: GetIdeaBankResponseDto
): IIdeaBankResponse {
	return {
		ideas: dto.ideas.map(toIdeaFromDto),
		total: dto.total,
		limit: dto.limit,
		offset: dto.offset,
	};
}
