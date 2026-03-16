import { useTranslate } from "@tolgee/react";
import { useCallback, useState } from "react";
import { useDeleteClients } from "./use-delete-clients.hook";

/**
 * Response interface for the useDeleteClientsModal hook
 */
interface UseDeleteClientsModalResponse {
	/** Whether the confirmation modal is open */
	isModalOpen: boolean;
	/** Whether a delete operation is in progress */
	isDeleting: boolean;
	/** Error message if deletion fails */
	error: string | null;
	/** Array of client IDs to be deleted */
	clientsToDelete: string[];
	/** Number of clients to be deleted */
	clientCount: number;
	/** Opens the confirmation modal for the given client IDs */
	openModal: (clientIds: string[]) => void;
	/** Closes the confirmation modal */
	closeModal: () => void;
	/** Confirms and executes the deletion */
	confirmDelete: () => Promise<boolean>;
	/** Clears any error state */
	clearError: () => void;
	/** Modal title for translation */
	modalTitle: string;
	/** Modal description for translation */
	modalDescription: string;
}

/**
 * Custom hook to manage the delete clients confirmation modal
 *
 * Provides state management for showing a confirmation modal before deleting clients,
 * handling the actual deletion, and managing loading/error states.
 *
 * @returns Object containing modal state and functions
 *
 * @example
 * ```typescript
 * const {
 *   isModalOpen,
 *   isDeleting,
 *   openModal,
 *   closeModal,
 *   confirmDelete,
 *   modalTitle,
 *   modalDescription
 * } = useDeleteClientsModal();
 *
 * // Open modal for selected clients
 * openModal(["client1", "client2"]);
 *
 * // In the modal component
 * <ConfirmDeleteModal
 *   isOpen={isModalOpen}
 *   onClose={closeModal}
 *   onConfirm={confirmDelete}
 *   title={modalTitle}
 *   description={modalDescription}
 *   isLoading={isDeleting}
 * />
 * ```
 */
export const useDeleteClientsModal = (): UseDeleteClientsModalResponse => {
	const { t } = useTranslate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [clientsToDelete, setClientsToDelete] = useState<string[]>([]);

	const { deleteClients, isDeleting, error, clearError } = useDeleteClients();

	/**
	 * Opens the confirmation modal for the given client IDs
	 *
	 * @param clientIds - Array of client IDs to delete
	 */
	const openModal = useCallback((clientIds: string[]) => {
		setClientsToDelete(clientIds);
		setIsModalOpen(true);
	}, []);

	/**
	 * Closes the confirmation modal and clears state
	 */
	const closeModal = useCallback(() => {
		setIsModalOpen(false);
		setClientsToDelete([]);
		clearError();
	}, [clearError]);

	/**
	 * Confirms and executes the deletion
	 *
	 * @returns Promise<boolean> - True if successful, false if failed
	 */
	const confirmDelete = useCallback(async (): Promise<boolean> => {
		const success = await deleteClients(clientsToDelete);
		return success;
	}, [deleteClients, clientsToDelete]);

	const clientCount = clientsToDelete.length;

	// Generate modal title and description based on client count
	const modalTitle =
		clientCount === 1
			? t("confirm_delete_client_title", "Eliminar contacto")
			: t("confirm_delete_clients_title", "Eliminar contactos");

	const modalDescription =
		clientCount === 1
			? t(
					"confirm_delete_client_description",
					"¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer."
				)
			: t("confirm_delete_clients_description", {
					count: clientCount,
					defaultValue: `¿Estás seguro de que deseas eliminar ${clientCount} contactos? Esta acción no se puede deshacer.`,
				});

	return {
		isModalOpen,
		isDeleting,
		error,
		clientsToDelete,
		clientCount,
		openModal,
		closeModal,
		confirmDelete,
		clearError,
		modalTitle,
		modalDescription,
	};
};
