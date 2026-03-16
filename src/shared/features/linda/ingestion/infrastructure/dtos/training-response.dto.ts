export interface TrainingStatusResponseDto {
	success: boolean;
	message: string;
	data: {
		found: boolean;
		execution: {
			id: string;
			agencyId: string;
			companyId: string;
			status: string;
			urlsProcessed: number;
			assetsProcessed: number;
			hasCriticalErrors: boolean;
			createdAt: string;
			updatedAt: string;
			startedAt: string;
		} | null;
		steps: Array<{
			id: string;
			stepName: string;
			status: string;
			isCritical: boolean;
			successCount: number;
			errorCount: number;
			createdAt: string;
			startedAt: string;
			completedAt?: string;
			durationMs?: number;
		}>;
	};
	timestamp: string;
}

export interface StartTrainingResponseDto {
	success: boolean;
	message: string;
	data: {
		executionId: string;
		status: string;
		message: string;
		agencyId: string;
		companyId: string;
		urlsCount: number;
	};
	timestamp: string;
}
