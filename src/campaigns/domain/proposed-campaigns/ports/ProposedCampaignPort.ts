import type { Result } from "@shared/domain/errors/Result";
import type {
	IProposedCampaignsResponse,
} from "../interfaces/ProposedCampaign";
import type {
	DeleteProposedCampaignError,
	GetProposedCampaignError,
} from "../errors/ProposedCampaignError";

/**
 * Puerto para operaciones con campañas propuestas
 */
export interface IProposedCampaignsPort {
	/**
	 * Obtiene campañas propuestas paginadas
	 */
	getProposedCampaigns(
		limit?: number,
		offset?: number
	): Promise<Result<IProposedCampaignsResponse, GetProposedCampaignError>>;

	/**
	 * Elimina una campaña propuesta
	 */
	deleteProposedCampaign(
		id: string
	): Promise<Result<void, DeleteProposedCampaignError>>;
}
