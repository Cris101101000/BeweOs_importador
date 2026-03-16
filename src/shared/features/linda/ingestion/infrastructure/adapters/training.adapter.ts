import { Result } from "@shared/domain/errors/Result";
import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import { GetTrainingStatusError } from "../../domain/errors/GetTrainingStatusError";
import { StartTrainingError } from "../../domain/errors/StartTrainingError";
import type {
	IStartTrainingResponse,
	ITrainingStatusResponse,
} from "../../domain/interfaces/training";
import type { ITrainingPort } from "../../domain/ports/training.port";
import type {
	StartTrainingResponseDto,
	TrainingStatusResponseDto,
} from "../dtos/training-response.dto";
import { TrainingMapper } from "../mappers/training.mapper";

export class TrainingAdapter implements ITrainingPort {
	private readonly httpClient: IHttpClient = httpService;

	async startTraining(
		urls: string[]
	): Promise<Result<IStartTrainingResponse, StartTrainingError>> {
		const response = await this.httpClient.post<StartTrainingResponseDto>(
			"linda/training/start",
			{ urls }
		);

		if (response.success && response.data) {
			return Result.Ok(TrainingMapper.toStartDomain(response.data));
		}

		return Result.Err(
			new StartTrainingError(
				response.error?.message || "Failed to start training"
			)
		);
	}

	async getTrainingStatus(): Promise<
		Result<ITrainingStatusResponse, GetTrainingStatusError>
	> {
		const response = await this.httpClient.get<TrainingStatusResponseDto>(
			"linda/training/status"
		);

		if (response.success && response.data) {
			return Result.Ok(TrainingMapper.toStatusDomain(response.data));
		}

		return Result.Err(
			new GetTrainingStatusError(
				response.error?.message || "Failed to get training status"
			)
		);
	}
}
