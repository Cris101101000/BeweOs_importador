import { Result } from "@shared/domain/errors/Result";
import type { IProposedCampaignsPort } from "@campaigns/domain/proposed-campaigns/ports/ProposedCampaignPort";
import { DeleteProposedCampaignError } from "@campaigns/domain/proposed-campaigns/errors/ProposedCampaignError";

/**
 * UseCase para eliminar una campaña propuesta
 */
export class DeleteProposedCampaignUseCase {
	constructor(private readonly proposedCampaignsPort: IProposedCampaignsPort) {}

	/**
	 * Ejecuta el caso de uso
	 * @param id - ID de la campaña propuesta a eliminar
	 */
	async execute(id: string): Promise<Result<void, DeleteProposedCampaignError>> {
		try {
			return await this.proposedCampaignsPort.deleteProposedCampaign(id);
		} catch (error) {
			console.error("Error al eliminar campaña propuesta:", error);
			return Result.Err(
				new DeleteProposedCampaignError(
					error instanceof Error ? error.message : "Error al eliminar campaña propuesta"
				)
			);
		}
	}
}
