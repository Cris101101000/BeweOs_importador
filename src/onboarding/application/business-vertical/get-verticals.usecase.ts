import type { Result } from "@shared/domain/errors/Result";
import type { IBusinessVerticalRepository } from "src/onboarding/domain/business-vertical/ports/business-vertical.port";

export class GetVerticalsUseCase {
	constructor(private readonly repository: IBusinessVerticalRepository) {}

	async execute(): Promise<Result<string[], Error>> {
		return await this.repository.getVerticals();
	}
}
