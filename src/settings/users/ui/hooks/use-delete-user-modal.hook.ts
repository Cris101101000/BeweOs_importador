import { useState } from "react";

/**
 * Custom hook to manage the state of the delete user confirmation modal.
 */
export const useDeleteUserModal = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<string | null>(null);

	const openModal = (userId: string) => {
		setUserToDelete(userId);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setUserToDelete(null);
		setIsModalOpen(false);
	};

	return {
		isModalOpen,
		userToDelete,
		openModal,
		closeModal,
	};
};
