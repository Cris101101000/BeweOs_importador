import type { INotificationStats } from "../../domain/interfaces/dashboard.interface";
import type { GetNotificationStatsDataDto } from "../dtos/get-notification-stats.dto";
import { mockNotificationStats } from "../mocks/dashboard-response.mock";

/**
 * Mapea la respuesta de la API (data) al modelo de dominio notificationStats.
 * Convierte channelPerformance -> channel para consistencia en el dominio.
 */
export const toNotificationStatsFromDto = (
	dto: GetNotificationStatsDataDto
): INotificationStats => ({
	sentCount: dto.sentCount,// === 0 ? 1500: dto.sentCount,
	deliveredCount: dto.deliveredCount,// === 0 ? 600 : dto.deliveredCount,
	readCount: dto.readCount,// === 0 ? 450 : dto.readCount,
	readRate: dto.readRate,// === 0 ? 75 : dto.readRate,
	channel: {
		whatsapp: {
			sentCount: dto.channelPerformance?.whatsapp?.sentCount,// === 0 ? 1200 : dto.channelPerformance?.whatsapp?.sentCount,
			readCount: dto.channelPerformance?.whatsapp?.readCount,// === 0 ? 942 : dto.channelPerformance?.whatsapp?.readCount,
			readRate: dto.channelPerformance?.whatsapp?.readRate,// === 0 ? 94.2 : dto.channelPerformance?.whatsapp?.readRate	,
		},
		email: {
			sentCount: dto.channelPerformance?.email?.sentCount,// === 0 ? 956 : dto.channelPerformance?.email?.sentCount,
			readCount: dto.channelPerformance?.email?.readCount,// === 0 ? 668 : dto.channelPerformance?.email?.readCount,
			readRate: dto.channelPerformance?.email?.readRate,// === 0 ? 90.2 : dto.channelPerformance?.email?.readRate,
		},
	},
});
