/** DTO del body `data` de la respuesta GET /companies/me/configuration-progress */
export interface GetConfigurationProgressDataDto {
	percentageCompleted: number;
	completedMilestones: number;
	totalMilestones: number;
	milestones: {
		hasProductOrService: boolean;
		hasFirstClient: boolean;
		hasWhatsAppIntegration: boolean;
		hasInstagramIntegration: boolean;
	};
}
