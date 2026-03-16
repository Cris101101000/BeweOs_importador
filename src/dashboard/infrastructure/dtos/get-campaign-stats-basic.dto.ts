/** DTO del body `data` de la respuesta GET /campaigns/stats/basic */
export interface GetCampaignStatsBasicDataDto {
	totalCampaignsSent: number;
	totalCampaignsSentVariationPct: number;
	interactionRate: number;
	interactionRateVariationPct: number;
}
