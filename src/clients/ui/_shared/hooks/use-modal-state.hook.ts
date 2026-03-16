/**
 * Generic hook for managing modal state
 * Eliminates repetitive modal state management code
 */

import { useCallback, useState } from "react";

interface UseModalStateResponse {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

/**
 * Generic hook for managing modal open/close state
 * @param initialState - Initial state of the modal (default: false)
 * @returns Object with isOpen state and control functions
 */
export const useModalState = (initialState = false): UseModalStateResponse => {
	const [isOpen, setIsOpen] = useState<boolean>(initialState);

	const open = useCallback(() => {
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	const toggle = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	return {
		isOpen,
		open,
		close,
		toggle,
	};
};

/**
 * Hook for managing modal state with data
 * Useful for modals that need to store associated data (e.g., selected item)
 */
interface UseModalWithDataResponse<T> {
	isOpen: boolean;
	data: T | null;
	open: (data: T) => void;
	close: () => void;
	toggle: (data?: T) => void;
}

export const useModalWithData = <T>(
	initialState = false
): UseModalWithDataResponse<T> => {
	const [isOpen, setIsOpen] = useState<boolean>(initialState);
	const [data, setData] = useState<T | null>(null);

	const open = useCallback((modalData: T) => {
		setData(modalData);
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		setData(null);
	}, []);

	const toggle = useCallback(
		(modalData?: T) => {
			if (isOpen) {
				close();
			} else if (modalData) {
				open(modalData);
			}
		},
		[isOpen, close, open]
	);

	return {
		isOpen,
		data,
		open,
		close,
		toggle,
	};
};
