import type { Result } from "@shared/domain/errors/Result";
import type { GetTrainingStatusError } from "../domain/errors/GetTrainingStatusError";
import type { ITrainingStatusResponse } from "../domain/interfaces/training";
import type { ITrainingPort } from "../domain/ports/training.port";

export class GetTrainingStatusUseCase {
	constructor(private readonly trainingPort: ITrainingPort) {}

	async execute(): Promise<
		Result<ITrainingStatusResponse, GetTrainingStatusError>
	> {
		return await this.trainingPort.getTrainingStatus();
	}
}
