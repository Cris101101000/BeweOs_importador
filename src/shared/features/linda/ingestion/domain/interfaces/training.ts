import type { TrainingStatus } from "../enums/training-status.enum";

export interface ITrainingExecution {
	id: string;
	status: TrainingStatus;
	urlsProcessed: number;
	assetsProcessed: number;
	hasCriticalErrors: boolean;
}

export interface ITrainingStatusResponse {
	found: boolean;
	execution: ITrainingExecution | null;
}

export interface IStartTrainingResponse {
	executionId: string;
	status: string;
	message: string;
	urlsCount: number;
}
