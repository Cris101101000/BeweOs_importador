import type { ICampaignStatsMostActiveNetwork } from "../../domain/interfaces/dashboard.interface";
import type { GetCampaignStatsMostActiveNetworkDataDto } from "../dtos/get-campaign-stats-most-active-network.dto";

/**
 * Mapea la respuesta de la API (data) al modelo de dominio.
 * conversionRate: si deliveredCount > 0 → (clickCount / deliveredCount) * 100; si no → engagement (si <= 1 se trata como 0-1 y se multiplica por 100).
 * customerAcquisitionCost y returnOnInvestment: no vienen en el endpoint, se devuelven en 0.
 */
export const toCampaignStatsMostActiveNetworkFromDto = (
	dto: GetCampaignStatsMostActiveNetworkDataDto
): ICampaignStatsMostActiveNetwork => {
	const conversionRate =
		dto.deliveredCount > 0
			? (dto.clickCount / dto.deliveredCount) * 100
			: (dto.engagement ?? 0) <= 1
				? (dto.engagement ?? 0) * 100
				: (dto.engagement ?? 0);
	return {
		conversionRate: Number(conversionRate.toFixed(1)),
		customerAcquisitionCost: 0,
		returnOnInvestment: 0,
	};
};
