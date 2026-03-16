import type { Result } from "@shared/domain/errors/Result";
import type { IBusinessVerticalRepository } from "src/onboarding/domain/business-vertical/ports/business-vertical.port";

export class SaveVerticalUseCase {
	constructor(private readonly repository: IBusinessVerticalRepository) {}

	async execute(vertical: string): Promise<Result<void, Error>> {
		return await this.repository.saveVertical(vertical);
	}
}
