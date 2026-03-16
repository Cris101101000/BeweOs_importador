import type { ICampaignStatsBasic } from "../../domain/interfaces/dashboard.interface";
import type { GetCampaignStatsBasicDataDto } from "../dtos/get-campaign-stats-basic.dto";

/**
 * Mapea la respuesta de la API (data) al modelo de dominio campaign stats basic.
 * totalCampaignsSent -> totalCampaigns
 * totalCampaignsSentVariationPct -> totalCampaignsTrend (value para la prop trend)
 * interactionRate -> interactionRate
 * interactionRateVariationPct -> interactionRateTrend (value para la prop trend)
 */
export const toCampaignStatsBasicFromDto = (
	dto: GetCampaignStatsBasicDataDto
): ICampaignStatsBasic => ({
	totalCampaigns: dto.totalCampaignsSent,
	totalCampaignsTrend: {
		value: dto.totalCampaignsSentVariationPct,
		isPositive: dto.totalCampaignsSentVariationPct >= 0,
	},
	interactionRate: dto.interactionRate,
	interactionRateTrend: {
		value: dto.interactionRateVariationPct,
		isPositive: dto.interactionRateVariationPct >= 0,
	},
});
