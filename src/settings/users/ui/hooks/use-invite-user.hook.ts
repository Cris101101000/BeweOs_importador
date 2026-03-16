import { useCallback, useState } from "react";
import { InviteUserUseCase } from "../../application/invite-user.usecase";
import { UserAdapter } from "../../infrastructure/adapters/user.adapter";

/**
 * Custom hook to handle the user invitation logic.
 */
export const useInviteUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const inviteUser = async (email: string, roles: string[]) => {
		setIsLoading(true);
		setError(null);
		setIsSuccess(false);
		try {
			const adapter = new UserAdapter();
			const useCase = new InviteUserUseCase(adapter);
			await useCase.execute(email, roles);
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

	return { inviteUser, isLoading, error, isSuccess, reset };
};
