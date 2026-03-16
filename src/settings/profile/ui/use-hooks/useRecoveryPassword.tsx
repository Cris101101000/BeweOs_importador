import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import { useState } from "react";
import { RecoveryPasswordUseCase } from "../../application/recovery-password.usecase";
import type {
	IRecoveryPasswordRequest,
	IRecoveryPasswordResponse,
} from "../../domain/interfaces/recovery-password.interface";
import { RecoveryPasswordAdapter } from "../../infrastructure/adapters/recovery-password.adapter";

interface UseRecoveryPasswordReturn {
	isLoading: boolean;
	error: string | null;
	recoveryPassword: (
		userId: string
	) => Promise<IResponse<IRecoveryPasswordResponse>>;
	reset: () => void;
}

export const useRecoveryPassword = (): UseRecoveryPasswordReturn => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const recoveryPassword = async (
		userId: string
	): Promise<IResponse<IRecoveryPasswordResponse>> => {
		setIsLoading(true);
		setError(null);

		try {
			const adapter = new RecoveryPasswordAdapter();
			const useCase = new RecoveryPasswordUseCase(adapter);

			const request: IRecoveryPasswordRequest = { userId };
			const response = await useCase.execute(request);

			if (!response.success) {
				setError(response.message);
			}

			return response;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			setError(errorMessage);

			return {
				success: false,
				message: errorMessage,
				timestamp: new Date().toISOString(),
				error: {
					code: "RECOVERY_PASSWORD_ERROR",
					message: errorMessage,
				},
			};
		} finally {
			setIsLoading(false);
		}
	};

	const reset = () => {
		setError(null);
		setIsLoading(false);
	};

	return {
		isLoading,
		error,
		recoveryPassword,
		reset,
	};
};
