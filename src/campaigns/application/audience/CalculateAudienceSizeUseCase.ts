import { Result } from "@shared/domain/errors/Result";
import type { IAudienceFilter } from "@campaigns/domain/audience/interfaces/Audience";
import type { IAudiencePort } from "@campaigns/domain/audience/ports/AudiencePort";
import { CalculateAudienceError } from "@campaigns/domain/audience/errors/AudienceError";

/**
 * UseCase para calcular el tamaño de audiencia según filtros
 */
export class CalculateAudienceSizeUseCase {
	constructor(private readonly audiencePort: IAudiencePort) {}

	async execute(filter: IAudienceFilter): Promise<Result<number, CalculateAudienceError>> {
		try {
			return await this.audiencePort.calculateAudienceSize(filter);
		} catch (error) {
			console.error("Error al calcular tamaño de audiencia:", error);
			return Result.Err(
				new CalculateAudienceError(
					error instanceof Error ? error.message : "Error al calcular tamaño de audiencia"
				)
			);
		}
	}
}
