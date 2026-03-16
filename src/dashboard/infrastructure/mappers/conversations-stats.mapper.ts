import type { IConversationsStats } from "../../domain/interfaces/dashboard.interface";
import type { GetConversationsStatsDataDto } from "../dtos/get-conversations-stats.dto";

function toTrendFromVariationPct(pct: number | undefined): IConversationsStats["totalConversationsTrend"] {
	if (pct === undefined || pct === null) return undefined;
	return {
		value: Math.abs(pct),
		isPositive: pct >= 0,
	};
}

/**
 * Mapea la respuesta de la API (data) al modelo de dominio conversationsStats.
 * API -> dominio: totalResolvedConversations -> answeredQuestions,
 * totalPendingUserResponses -> pendingQuestions, totalPendingKnowledgeGaps -> pendingGaps.
 * Variación % -> trend { value, isPositive } para cada card.
 */
export const toConversationsStatsFromDto = (
	dto: GetConversationsStatsDataDto
): IConversationsStats => ({
	totalConversations: dto.totalConversations,
	answeredQuestions: dto.totalResolvedConversations,
	pendingQuestions: dto.totalPendingUserResponses,
	pendingGaps: dto.totalPendingKnowledgeGaps,
	totalConversationsTrend: toTrendFromVariationPct(dto.totalConversationsVariationPct),
	answeredQuestionsTrend: toTrendFromVariationPct(dto.totalResolvedConversationsVariationPct),
	pendingQuestionsTrend: toTrendFromVariationPct(dto.totalPendingUserResponsesVariationPct),
	pendingGapsTrend: toTrendFromVariationPct(dto.totalPendingKnowledgeGapsVariationPct),
});
