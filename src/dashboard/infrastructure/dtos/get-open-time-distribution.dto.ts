/** DTO de un intervalo en la respuesta GET /notifications/stats/open-time-distribution */
export interface OpenTimeDistributionIntervalDto {
	key: string;
	label: string;
	email: number;
	whatsapp: number;
}

/** DTO del body `data` de la respuesta GET /notifications/stats/open-time-distribution */
export interface GetOpenTimeDistributionDataDto {
	intervals: OpenTimeDistributionIntervalDto[];
}
