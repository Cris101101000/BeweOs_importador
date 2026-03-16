import { useCallback, useState } from "react";
import { DeleteUserUseCase } from "../../application/delete-user.usecase";
import { UserAdapter } from "../../infrastructure/adapters/user.adapter";

/**
 * Custom hook to handle the user deletion logic.
 */
export const useDeleteUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const deleteUser = async (userId: string) => {
		setIsLoading(true);
		setError(null);
		setIsSuccess(false);
		try {
			const adapter = new UserAdapter();
			const useCase = new DeleteUserUseCase(adapter);
			await useCase.execute(userId);
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

	return { deleteUser, isLoading, error, isSuccess, reset };
};
