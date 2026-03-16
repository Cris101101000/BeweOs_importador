import type {
	IContactsStats,
	IContactsStatsTrend,
} from "../../domain/interfaces/dashboard.interface";
import type { GetClientsStatsDataDto } from "../dtos/get-clients-stats.dto";

function toTrend(growthPct: number | null): IContactsStatsTrend | null {
	if (growthPct == null) return null;
	return {
		value: Math.abs(growthPct),
		isPositive: growthPct >= 0,
	};
}

/**
 * Mapea la respuesta de la API GET /clients/stats al modelo de dominio IContactsStats.
 * totalClients → totalContacts, totalClientsGrowthPct → totalContactsTrend
 * newClientsInPeriod → newContacts, newClientsGrowthPct → newContactsTrend
 * totalLindaClients → contactsGeneratedByLinda, totalLindaClientsGrowthPct → contactsGeneratedByLindaTrend
 */
export const toContactsStatsFromDto = (
	dto: GetClientsStatsDataDto
): IContactsStats => ({
	totalContacts: dto.totalClients ?? 0,
	totalContactsTrend: toTrend(dto.totalClientsGrowthPct ?? null),
	newContacts: dto.newClientsInPeriod ?? 0,
	newContactsTrend: toTrend(dto.newClientsGrowthPct ?? null),
	contactsGeneratedByLinda: dto.totalLindaClients ?? 0,
	contactsGeneratedByLindaTrend: toTrend(dto.totalLindaClientsGrowthPct ?? null),
});
