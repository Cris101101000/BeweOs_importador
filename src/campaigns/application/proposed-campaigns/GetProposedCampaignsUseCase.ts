import { Result } from "@shared/domain/errors/Result";
import type { IProposedCampaignsResponse } from "@campaigns/domain/proposed-campaigns/interfaces/ProposedCampaign";
import type { IProposedCampaignsPort } from "@campaigns/domain/proposed-campaigns/ports/ProposedCampaignPort";
import { GetProposedCampaignError } from "@campaigns/domain/proposed-campaigns/errors/ProposedCampaignError";

/**
 * UseCase para obtener campañas propuestas paginadas
 */
export class GetProposedCampaignsUseCase {
	constructor(private readonly proposedCampaignsPort: IProposedCampaignsPort) {}

	/**
	 * Ejecuta el caso de uso
	 * @param limit - Número de campañas a retornar
	 * @param offset - Offset para paginación
	 */
	async execute(
		limit = 20,
		offset = 0
	): Promise<Result<IProposedCampaignsResponse, GetProposedCampaignError>> {
		try {
			return await this.proposedCampaignsPort.getProposedCampaigns(limit, offset);
		} catch (error) {
			console.error("Error al obtener campañas propuestas:", error);
			return Result.Err(
				new GetProposedCampaignError(
					error instanceof Error ? error.message : "Error al obtener campañas propuestas"
				)
			);
		}
	}
}
