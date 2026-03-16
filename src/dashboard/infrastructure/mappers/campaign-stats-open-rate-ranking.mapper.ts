import type { ICampaign } from "../../domain/interfaces/dashboard.interface";
import type { GetCampaignStatsOpenRateRankingDataDto } from "../dtos/get-campaign-stats-open-rate-ranking.dto";

/**
 * Mapea la respuesta de la API (data.items) a ICampaign[].
 * title -> name, openRate -> openRate. Ordenado por openRate descendente.
 */
export const toCampaignListFromOpenRateRankingDto = (
	dto: GetCampaignStatsOpenRateRankingDataDto
): ICampaign[] => {
	const items = dto.items ?? [];
	return [...items]
		.map((item) => ({ name: item.title, openRate: item.openRate }))
		.sort((a, b) => b.openRate - a.openRate);
};
