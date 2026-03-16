import type { ICommunication } from "@clients/domain/interfaces/communication.interface";
import type { INote } from "@clients/domain/interfaces/note.interface";
import { useCallback, useState } from "react";

interface DeleteModalState<T> {
	isOpen: boolean;
	item: T | null;
	isLoading: boolean;
}

interface UseDeleteModalsReturn {
	// Note modal state
	deleteNoteModal: DeleteModalState<INote>;
	openDeleteNoteModal: (note: INote) => void;
	closeDeleteNoteModal: () => void;
	setDeleteNoteLoading: (loading: boolean) => void;

	// Communication modal state
	deleteCommunicationModal: DeleteModalState<ICommunication>;
	openDeleteCommunicationModal: (communication: ICommunication) => void;
	closeDeleteCommunicationModal: () => void;
	setDeleteCommunicationLoading: (loading: boolean) => void;
}

/**
 * Custom hook to manage delete modal states for notes and communications
 * Provides centralized state management with memoized handlers
 */
export const useDeleteModals = (): UseDeleteModalsReturn => {
	const [deleteNoteModal, setDeleteNoteModal] = useState<
		DeleteModalState<INote>
	>({
		isOpen: false,
		item: null,
		isLoading: false,
	});

	const [deleteCommunicationModal, setDeleteCommunicationModal] = useState<
		DeleteModalState<ICommunication>
	>({
		isOpen: false,
		item: null,
		isLoading: false,
	});

	// Note modal handlers
	const openDeleteNoteModal = useCallback((note: INote) => {
		setDeleteNoteModal({ isOpen: true, item: note, isLoading: false });
	}, []);

	const closeDeleteNoteModal = useCallback(() => {
		setDeleteNoteModal({ isOpen: false, item: null, isLoading: false });
	}, []);

	const setDeleteNoteLoading = useCallback((loading: boolean) => {
		setDeleteNoteModal((prev) => ({ ...prev, isLoading: loading }));
	}, []);

	// Communication modal handlers
	const openDeleteCommunicationModal = useCallback(
		(communication: ICommunication) => {
			setDeleteCommunicationModal({
				isOpen: true,
				item: communication,
				isLoading: false,
			});
		},
		[]
	);

	const closeDeleteCommunicationModal = useCallback(() => {
		setDeleteCommunicationModal({
			isOpen: false,
			item: null,
			isLoading: false,
		});
	}, []);

	const setDeleteCommunicationLoading = useCallback((loading: boolean) => {
		setDeleteCommunicationModal((prev) => ({ ...prev, isLoading: loading }));
	}, []);

	return {
		deleteNoteModal,
		openDeleteNoteModal,
		closeDeleteNoteModal,
		setDeleteNoteLoading,
		deleteCommunicationModal,
		openDeleteCommunicationModal,
		closeDeleteCommunicationModal,
		setDeleteCommunicationLoading,
	};
};
