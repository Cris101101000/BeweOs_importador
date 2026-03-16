import { Result } from "@shared/domain/errors/Result";
import type { ICampaign } from "@campaigns/domain/campaign-management/interfaces/Campaign";
import type { ICampaignPort } from "@campaigns/domain/campaign-management/ports/CampaignPort";
import { GetCampaignError } from "@campaigns/domain/campaign-management/errors/CampaignError";

/**
 * Caso de uso: Obtener todas las campañas
 */
export class GetAllCampaignsUseCase {
	constructor(private readonly campaignPort: ICampaignPort) {}

	async execute(): Promise<Result<ICampaign[], GetCampaignError>> {
		try {
			return await this.campaignPort.getAllCampaigns();
		} catch (error) {
			console.error("Error al obtener campañas:", error);
			return Result.Err(
				new GetCampaignError(
					error instanceof Error ? error.message : "No se pudieron cargar las campañas"
				)
			);
		}
	}
}
