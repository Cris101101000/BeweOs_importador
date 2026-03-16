import { useCallback, useEffect, useState } from "react";
import { GetUsersUseCase } from "../../application/get-users.usecase";
import type { IUser } from "../../domain/interfaces/user.interface";
import { UserAdapter } from "../../infrastructure/adapters/user.adapter";

/**
 * Custom hook to fetch the list of users.
 */
export const useGetUsers = () => {
	const [users, setUsers] = useState<IUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const adapter = new UserAdapter();
			const useCase = new GetUsersUseCase(adapter);
			const fetchedUsers = await useCase.execute();
			setUsers(fetchedUsers);
		} catch (e: any) {
			setError(e.message || "An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return { users, isLoading, error, refetch: fetchUsers };
};
