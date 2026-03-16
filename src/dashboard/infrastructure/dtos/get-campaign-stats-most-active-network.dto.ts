/** DTO del body `data` de la respuesta GET /campaigns/stats/most-active-network */
export interface GetCampaignStatsMostActiveNetworkDataDto {
	network: string;
	interactionEvents: number;
	deliveredCount: number;
	clickCount: number;
	engagement: number;
}
