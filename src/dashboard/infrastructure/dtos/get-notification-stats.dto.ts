/** DTO de estadísticas por canal (respuesta API) */
export interface NotificationChannelStatsDto {
	sentCount: number;
	readCount: number;
	readRate: number;
}

/** DTO del body `data` de la respuesta GET /notifications/stats */
export interface GetNotificationStatsDataDto {
	sentCount: number;
	deliveredCount: number;
	readCount: number;
	readRate: number;
	channelPerformance: {
		whatsapp: NotificationChannelStatsDto;
		email: NotificationChannelStatsDto;
	};
}
