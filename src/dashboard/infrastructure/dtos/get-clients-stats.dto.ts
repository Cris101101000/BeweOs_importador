/** Item de periodo en clientsCreatedByPeriod / lindaClientsCreatedByPeriod (respuesta API) */
export interface ClientsCreatedByPeriodItemDto {
	periodStart: string;
	periodEnd: string;
	count: number;
}

/** DTO del body `data` de la respuesta GET /clients/stats */
export interface GetClientsStatsDataDto {
	clientsCreatedByPeriod?: ClientsCreatedByPeriodItemDto[];
	totalClients: number;
	totalClientsGrowthPct: number | null;
	newClientsInPeriod: number;
	newClientsGrowthPct: number | null;
	lindaClientsCreatedByPeriod?: ClientsCreatedByPeriodItemDto[];
	totalLindaClients: number;
	totalLindaClientsGrowthPct: number | null;
}
