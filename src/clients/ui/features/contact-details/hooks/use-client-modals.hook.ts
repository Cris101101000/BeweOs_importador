import { useCallback, useState } from "react";

interface UseClientModalsResponse {
	isDeleteModalOpen: boolean;
	isEditModalOpen: boolean;
	openDeleteModal: () => void;
	closeDeleteModal: () => void;
	openEditModal: () => void;
	closeEditModal: () => void;
}

/**
 * React hook that manages the state of client-related modals
 */
export const useClientModals = (): UseClientModalsResponse => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const openDeleteModal = useCallback(() => {
		setIsDeleteModalOpen(true);
	}, []);

	const closeDeleteModal = useCallback(() => {
		setIsDeleteModalOpen(false);
	}, []);

	const openEditModal = useCallback(() => {
		setIsEditModalOpen(true);
	}, []);

	const closeEditModal = useCallback(() => {
		setIsEditModalOpen(false);
	}, []);

	return {
		isDeleteModalOpen,
		isEditModalOpen,
		openDeleteModal,
		closeDeleteModal,
		openEditModal,
		closeEditModal,
	};
};
