/** DTO del body `data` de la respuesta GET /linda/chat-sessions/stats */
export interface GetConversationsStatsDataDto {
	totalConversations: number;
	totalResolvedConversations: number;
	totalPendingUserResponses: number;
	totalPendingKnowledgeGaps: number;
	totalConversationsVariationPct?: number;
	totalResolvedConversationsVariationPct?: number;
	totalPendingUserResponsesVariationPct?: number;
	totalPendingKnowledgeGapsVariationPct?: number;
}
