import type { Result } from "@shared/domain/errors/Result";
import type { GetTrainingStatusError } from "../errors/GetTrainingStatusError";
import type { StartTrainingError } from "../errors/StartTrainingError";
import type {
	IStartTrainingResponse,
	ITrainingStatusResponse,
} from "../interfaces/training";

export interface ITrainingPort {
	startTraining(
		urls: string[]
	): Promise<Result<IStartTrainingResponse, StartTrainingError>>;
	getTrainingStatus(): Promise<
		Result<ITrainingStatusResponse, GetTrainingStatusError>
	>;
}
