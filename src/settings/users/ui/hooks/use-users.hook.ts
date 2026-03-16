import { useMemo, useState } from "react";

import { useGetUsers } from "./use-get-users.hook";

const ROWS_PER_PAGE = 5;

/**
 * Custom hook to manage the state and logic for the users table.
 * It combines user fetching logic with pagination and action handlers.
 *
 * @returns An object containing all the necessary state and callbacks for the users view.
 */
export const useUsers = () => {
	const { users, isLoading, error, refetch } = useGetUsers();
	const [page, setPage] = useState(1);

	const pages = Math.ceil(users.length / ROWS_PER_PAGE);

	const items = useMemo(() => {
		const start = (page - 1) * ROWS_PER_PAGE;
		const end = start + ROWS_PER_PAGE;
		return users.slice(start, end);
	}, [page, users]);

	return {
		page,
		setPage,
		items,
		pages,
		isLoading,
		error,
		refetch,
		userCount: users.length,
	};
};
