import { useState } from "react";

/**
 * Custom hook to manage the state of the invite user modal.
 */
export const useInviteUserModal = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return {
		isModalOpen,
		openModal,
		closeModal,
	};
};
