import type { Result } from "@shared/domain/errors/Result";
import type { IOnboardingActivateRepository } from "src/onboarding/domain/onboarding-activate/ports/onboarding-activate.port";

export class ActivateOnboardingUseCase {
	constructor(private readonly repository: IOnboardingActivateRepository) {}

	async execute(): Promise<Result<void, Error>> {
		return await this.repository.activate();
	}
}
