import { useCallback, useState } from "react";
import { UpdateUserUseCase } from "../../application/update-user.usecase";
import type { IUser } from "../../domain/interfaces/user.interface";
import { UserAdapter } from "../../infrastructure/adapters/user.adapter";

/**
 * Custom hook to handle the user update logic.
 */
export const useUpdateUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const updateUser = async (userId: number, data: Partial<IUser>) => {
		setIsLoading(true);
		setError(null);
		setIsSuccess(false);
		try {
			const adapter = new UserAdapter();
			const useCase = new UpdateUserUseCase(adapter);
			await useCase.execute(userId.toString(), data);
			setIsSuccess(true);
		} catch (e: any) {
			setError(e.message || "An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	const reset = useCallback(() => {
		setError(null);
		setIsSuccess(false);
	}, []);

	return { updateUser, isLoading, error, isSuccess, reset };
};
