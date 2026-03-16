import { create } from "zustand";

interface ConfirmDeleteModalState {
	isOpen: boolean;
	isLoading: boolean;
	title: string;
	description: string;
	itemName?: string;
	itemId?: string | number;
	onConfirm?: () => void | Promise<void>;
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
}

interface ConfirmDeleteModalActions {
	openModal: (params: {
		title: string;
		description: string;
		itemName?: string;
		itemId?: string | number;
		onConfirm?: () => void | Promise<void>;
		onSuccess?: () => void;
		onError?: (error: unknown) => void;
	}) => void;
	closeModal: () => void;
	setLoading: (isLoading: boolean) => void;
	confirmDelete: () => Promise<void>;
}

type ConfirmDeleteModalStore = ConfirmDeleteModalState &
	ConfirmDeleteModalActions;

const initialState: ConfirmDeleteModalState = {
	isOpen: false,
	isLoading: false,
	title: "",
	description: "",
	itemName: undefined,
	itemId: undefined,
	onConfirm: undefined,
	onSuccess: undefined,
	onError: undefined,
};

export const useConfirmDeleteModal = create<ConfirmDeleteModalStore>(
	(set, get) => ({
		...initialState,

		openModal: ({
			title,
			description,
			itemName,
			itemId,
			onConfirm,
			onSuccess,
			onError,
		}) => {
			set({
				isOpen: true,
				title,
				description,
				itemName,
				itemId,
				isLoading: false,
				onConfirm,
				onSuccess,
				onError,
			});
		},

		closeModal: () => {
			set(initialState);
		},

		setLoading: (isLoading) => {
			set({ isLoading });
		},

		confirmDelete: async () => {
			const { onConfirm, onSuccess, onError, closeModal, setLoading } = get();

			if (!onConfirm) {
				closeModal();
				return;
			}

			try {
				setLoading(true);
				await onConfirm();
				onSuccess?.();
				closeModal();
			} catch (error) {
				console.error("Error during delete confirmation:", error);
				onError?.(error);
				setLoading(false);
			}
		},
	})
);
