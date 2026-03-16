import type { IDashboardData } from "../../domain/interfaces/dashboard.interface";
import type { GetDashboardDataResponseDto } from "../dtos/get-dashboard-data.dto";
import {
	generateMockLineData,
	generateMockCampaignData,
	mockTopSocialPosts,
	mockLinearGraphData,
	mockOperationalData,
} from "../mocks/dashboard-response.mock";

/**
 * Mapea la respuesta del DTO de la API al dominio
 * Por ahora retorna datos mock, pero cuando tengamos la API real, aquí se hará el mapeo
 */
export const toDashboardDataFromDto = (
	dto: GetDashboardDataResponseDto
): IDashboardData => {
	// TODO: Cuando tengamos la API real, mapear desde el DTO
	// Por ahora retornamos los mocks
	return {
		operationalSummary: mockOperationalData,
		conversationData: generateMockLineData(),
		campaignData: generateMockCampaignData(),
		socialMediaPosts: mockTopSocialPosts,
		linearGraphData: mockLinearGraphData,
	};
};