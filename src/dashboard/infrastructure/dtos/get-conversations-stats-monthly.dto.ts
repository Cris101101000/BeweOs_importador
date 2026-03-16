/** DTO del body `data` de la respuesta GET /linda/chat-sessions/stats/monthly */
export interface GetConversationsStatsMonthlyDataDto {
	monthlyConversations: Array<{
		month: string;
		totalConversations: number;
	}>;
}
