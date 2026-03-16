import type { TrainingStatus } from "../../domain/enums/training-status.enum";
import type {
	IStartTrainingResponse,
	ITrainingStatusResponse,
} from "../../domain/interfaces/training";
import type {
	StartTrainingResponseDto,
	TrainingStatusResponseDto,
} from "../dtos/training-response.dto";

export class TrainingMapper {
	static toStatusDomain(
		dto: TrainingStatusResponseDto["data"]
	): ITrainingStatusResponse {
		return {
			found: dto.found,
			execution: dto.execution
				? {
						id: dto.execution.id,
						status: dto.execution.status as TrainingStatus,
						urlsProcessed: dto.execution.urlsProcessed,
						assetsProcessed: dto.execution.assetsProcessed,
						hasCriticalErrors: dto.execution.hasCriticalErrors,
					}
				: null,
		};
	}

	static toStartDomain(
		dto: StartTrainingResponseDto["data"]
	): IStartTrainingResponse {
		return {
			executionId: dto.executionId,
			status: dto.status,
			message: dto.message,
			urlsCount: dto.urlsCount,
		};
	}
}
