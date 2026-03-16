import type { Result } from "@shared/domain/errors/Result";

export interface IOnboardingActivateRepository {
	activate(): Promise<Result<void, Error>>;
}
