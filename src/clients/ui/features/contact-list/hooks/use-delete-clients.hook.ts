import { DeleteClientsUseCase } from "@clients/application/delete-clients.usecase";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo, useState } from "react";

/**
 * Response interface for the useDeleteClients hook
 */
interface UseDeleteClientsResponse {
	/** Whether a delete operation is currently in progress */
	isDeleting: boolean;
	/** Error message if deletion fails */
	error: string | null;
	/** Function to delete multiple clients */
	deleteClients: (clientIds: string[]) => Promise<boolean>;
	/** Function to clear any error state */
	clearError: () => void;
}

/**
 * Custom hook for deleting multiple clients
 *
 * Provides functionality to delete multiple clients with loading state,
 * error handling, and success/failure feedback.
 *
 * @returns Object containing delete functions and state
 *
 * @example
 * ```typescript
 * const { deleteClients, isDeleting, error } = useDeleteClients();
 *
 * const handleDelete = async () => {
 *   const success = await deleteClients(["id1", "id2"]);
 *   if (success) {
 *     console.log("Clients deleted successfully");
 *   }
 * };
 * ```
 */
export const useDeleteClients = (): UseDeleteClientsResponse => {
	const { t } = useTranslate();
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Initialize the use case with the adapter
	const deleteClientsUseCase = useMemo(() => {
		const adapter = new ClientAdapter();
		return new DeleteClientsUseCase(adapter);
	}, []);

	/**
	 * Deletes multiple clients by their IDs
	 *
	 * @param clientIds - Array of client IDs to delete
	 * @returns Promise<boolean> - True if successful, false if failed
	 */
	const deleteClients = useCallback(
		async (clientIds: string[]): Promise<boolean> => {
			setIsDeleting(true);
			setError(null);

			try {
				await deleteClientsUseCase.execute(clientIds);
				return true;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: t(
								"error_delete_clients_unknown",
								"An unknown error occurred while deleting clients"
							);

				setError(errorMessage);
				return false;
			} finally {
				setIsDeleting(false);
			}
		},
		[deleteClientsUseCase, t]
	);

	/**
	 * Clears any error state
	 */
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		isDeleting,
		error,
		deleteClients,
		clearError,
	};
};
