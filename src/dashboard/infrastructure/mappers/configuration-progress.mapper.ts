import type { IConfigurationProgress } from "../../domain/interfaces/dashboard.interface";
import type { GetConfigurationProgressDataDto } from "../dtos/get-configuration-progress.dto";

/**
 * Mapea la respuesta de la API GET /companies/me/configuration-progress
 * al modelo de dominio IConfigurationProgress.
 */
export const toConfigurationProgressFromDto = (
	dto: GetConfigurationProgressDataDto
): IConfigurationProgress => ({
	percentageCompleted: dto.percentageCompleted ?? 0,
	completedMilestones: dto.completedMilestones ?? 0,
	totalMilestones: dto.totalMilestones ?? 0,
	milestones: {
		hasProductOrService: dto.milestones?.hasProductOrService ?? false,
		hasFirstClient: dto.milestones?.hasFirstClient ?? false,
		hasWhatsAppIntegration: dto.milestones?.hasWhatsAppIntegration ?? false,
		hasInstagramIntegration: dto.milestones?.hasInstagramIntegration ?? false,
	},
});
