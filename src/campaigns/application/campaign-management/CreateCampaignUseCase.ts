import { Result } from "@shared/domain/errors/Result";
import type { ICampaign, ICreateCampaignInput } from "@campaigns/domain/campaign-management/interfaces/Campaign";
import type { ICampaignPort } from "@campaigns/domain/campaign-management/ports/CampaignPort";
import { CreateCampaignError } from "@campaigns/domain/campaign-management/errors/CampaignError";

/**
 * Caso de uso: Crear una nueva campaña
 */
export class CreateCampaignUseCase {
	constructor(private readonly campaignPort: ICampaignPort) {}

	async execute(
		input: ICreateCampaignInput
	): Promise<Result<ICampaign, CreateCampaignError>> {
		try {
			// Validaciones de negocio
			if (!input.name || input.name.trim().length === 0) {
				return Result.Err(new CreateCampaignError("El nombre de la campaña es obligatorio"));
			}

			if (!input.text || input.text.trim().length === 0) {
				return Result.Err(new CreateCampaignError("El contenido de la campaña es obligatorio"));
			}

			if (
				input.targetAudienceCount !== undefined &&
				input.targetAudienceCount <= 0
			) {
				return Result.Err(new CreateCampaignError("El tamaño de audiencia debe ser mayor a 0"));
			}

			return await this.campaignPort.createCampaign(input);
		} catch (error) {
			console.error("Error al crear campaña:", error);
			return Result.Err(
				new CreateCampaignError(
					error instanceof Error ? error.message : "No se pudo crear la campaña"
				)
			);
		}
	}
}
