import { useState } from "react";
import type { IUser } from "../../domain/interfaces/user.interface";

/**
 * Custom hook to manage the state of the edit user modal.
 */
export const useEditUserModal = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userToEdit, setUserToEdit] = useState<IUser | null>(null);

	const openModal = (user: IUser) => {
		setUserToEdit(user);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setUserToEdit(null);
		setIsModalOpen(false);
	};

	return {
		isModalOpen,
		userToEdit,
		openModal,
		closeModal,
	};
};
