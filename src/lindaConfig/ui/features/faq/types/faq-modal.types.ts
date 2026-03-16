import type { IFAQ, IUpdateFAQInput } from "../../../../domain/faq/interface";

// Create FAQ Modal Props
export interface ICreateFAQModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (faq: { question: string; answer: string }) => void;
	isLoading?: boolean;
	initialData?: { question: string; answer: string } | null;
}

// Edit FAQ Modal Props
export interface IEditFAQModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (faq: {
		id: string;
		question: string;
		answer: string;
		isActive: boolean;
	}) => void;
	onDelete?: (id: string) => void;
	faq: IFAQ | null;
	isLoading?: boolean;
}

// Delete FAQ Modal Props
export interface IDeleteFAQModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	faq: IFAQ | null;
	isLoading?: boolean;
}
