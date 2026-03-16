/** Item de periodo en aiCreatedByPeriod (respuesta API) */
export interface AiCreatedByPeriodItemDto {
	periodStart: string;
	periodEnd: string;
	count: number;
}

/** Item de top tag (respuesta API) */
export interface TopAiTagItemDto {
	tagName: string;
	usageCount: number;
}

/** DTO del body `data` de la respuesta GET /tags/stats/ai */
export interface GetTagsStatsDataDto {
	aiCreatedByPeriod: AiCreatedByPeriodItemDto[];
	growthVsPreviousPeriodPct: number;
	totalAiTags: number;
	aiTagsInUse: number;
	topAiTags: TopAiTagItemDto[];
}
