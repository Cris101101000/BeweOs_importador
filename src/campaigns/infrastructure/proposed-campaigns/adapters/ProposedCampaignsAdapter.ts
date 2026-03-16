import { Result } from "@shared/domain/errors/Result";
import type { IProposedCampaignsPort } from "@campaigns/domain/proposed-campaigns/ports/ProposedCampaignPort";
import type { IProposedCampaignsResponse } from "@campaigns/domain/proposed-campaigns/interfaces/ProposedCampaign";
import {
	GetProposedCampaignError,
	DeleteProposedCampaignError,
} from "@campaigns/domain/proposed-campaigns/errors/ProposedCampaignError";
import { mockProposedCampaigns } from "../../mocks/proposed-campaigns.mock";

/**
 * Adapter para operaciones con campañas propuestas
 * Implementa el puerto IProposedCampaignsPort usando datos mock
 */
export class ProposedCampaignsAdapter implements IProposedCampaignsPort {
	/**
	 * Obtiene campañas propuestas paginadas
	 */
	async getProposedCampaigns(
		limit = 20,
		offset = 0
	): Promise<Result<IProposedCampaignsResponse, GetProposedCampaignError>> {
		try {
			// Simular delay de red
			await new Promise((resolve) => setTimeout(resolve, 500));

			const startIndex = offset;
			const endIndex = offset + limit;
			const campaigns = (mockProposedCampaigns as any[]).slice(startIndex, endIndex);

			return Result.Ok({
				campaigns,
				total: mockProposedCampaigns.length,
				limit,
				offset,
			});
		} catch (error) {
			return Result.Err(
				new GetProposedCampaignError(
					error instanceof Error ? error.message : undefined
				)
			);
		}
	}

	/**
	 * Elimina una campaña propuesta
	 */
	async deleteProposedCampaign(
		id: string
	): Promise<Result<void, DeleteProposedCampaignError>> {
		try {
			// Simular delay de red
			await new Promise((resolve) => setTimeout(resolve, 300));

			const index = mockProposedCampaigns.findIndex((c: any) => c.id === id);
			if (index !== -1) {
				mockProposedCampaigns.splice(index, 1);
				return Result.Ok();
			}
			return Result.Err(
				new DeleteProposedCampaignError(`Campaña propuesta con id ${id} no encontrada`)
			);
		} catch (error) {
			return Result.Err(
				new DeleteProposedCampaignError(
					error instanceof Error ? error.message : undefined
				)
			);
		}
	}
}
