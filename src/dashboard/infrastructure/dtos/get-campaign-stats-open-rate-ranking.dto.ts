/** Item del ranking de tasa de apertura por campaña (respuesta API) */
export interface CampaignOpenRateRankingItemDto {
	campaignId: string;
	title: string;
	openRate: number;
}

/** DTO del body `data` de la respuesta GET /campaigns/stats/open-rate-ranking */
export interface GetCampaignStatsOpenRateRankingDataDto {
	items: CampaignOpenRateRankingItemDto[];
}
