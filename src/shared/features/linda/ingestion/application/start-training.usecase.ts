import type { Result } from "@shared/domain/errors/Result";
import type { StartTrainingError } from "../domain/errors/StartTrainingError";
import type { IStartTrainingResponse } from "../domain/interfaces/training";
import type { ITrainingPort } from "../domain/ports/training.port";

export class StartTrainingUseCase {
	constructor(private readonly trainingPort: ITrainingPort) {}

	async execute(
		urls: string[]
	): Promise<Result<IStartTrainingResponse, StartTrainingError>> {
		return await this.trainingPort.startTraining(urls);
	}
}
