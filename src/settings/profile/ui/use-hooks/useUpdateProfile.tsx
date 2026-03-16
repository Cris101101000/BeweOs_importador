import { getUserId } from "@beweco/utils-js";
import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import { useState } from "react";
import { UpdateProfileUseCase } from "../../application/update-profile.usecase";
import type {
	IUpdateProfileRequest,
	IUpdateProfileResponse,
} from "../../domain/interfaces/update-profile.interface";
import { UpdateProfileAdapter } from "../../infrastructure/adapters/update-profile.adapter";

interface UseUpdateProfileReturn {
	isLoading: boolean;
	error: string | null;
	updateProfile: (
		data: IUpdateProfileRequest
	) => Promise<IResponse<IUpdateProfileResponse>>;
	reset: () => void;
}

export const useUpdateProfile = (): UseUpdateProfileReturn => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateProfile = async (
		data: IUpdateProfileRequest
	): Promise<IResponse<IUpdateProfileResponse>> => {
		setIsLoading(true);
		setError(null);

		try {
			const userId = getUserId();
			const adapter = new UpdateProfileAdapter();
			const useCase = new UpdateProfileUseCase(adapter);

			const response = await useCase.execute(userId as string, data);

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
					code: "UPDATE_PROFILE_ERROR",
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
		updateProfile,
		reset,
	};
};
