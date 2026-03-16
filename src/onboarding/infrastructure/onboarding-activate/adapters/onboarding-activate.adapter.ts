import { Result } from "@shared/domain/errors/Result";
import { httpService } from "@shared/infrastructure/services/api-http.service";
import type { IOnboardingActivateRepository } from "src/onboarding/domain/onboarding-activate/ports/onboarding-activate.port";

export class OnboardingActivateAdapter implements IOnboardingActivateRepository {
	async activate(): Promise<Result<void, Error>> {
		try {
			const response = await httpService.get("/onboarding/activate");

			if (!response.success) {
				return Result.Err(
					new Error(
						response.message || "Error al activar el onboarding"
					)
				);
			}

			return Result.Ok();
		} catch (error) {
			return Result.Err(
				error instanceof Error
					? error
					: new Error("Error inesperado al activar el onboarding")
			);
		}
	}
}
