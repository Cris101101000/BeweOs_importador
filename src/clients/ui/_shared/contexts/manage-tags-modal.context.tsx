import type { IClient } from "@clients/domain/interfaces/client.interface";
import { ManageTagsModal } from "@clients/ui/features/contact-details/components/manage-tags-modal/manage-tags-modal.component";
import { useModalWithData } from "@clients/ui/_shared/hooks/use-modal-state.hook";
import { createContext, useContext, useMemo } from "react";
import type { FC, PropsWithChildren } from "react";

interface ManageTagsModalContextValue {
	openModal: (client: IClient) => void;
	closeModal: () => void;
}

const ManageTagsModalContext = createContext<
	ManageTagsModalContextValue | undefined
>(undefined);

export const useManageTagsModal = () => {
	const context = useContext(ManageTagsModalContext);
	if (!context) {
		throw new Error(
			"useManageTagsModal must be used within a ManageTagsModalProvider"
		);
	}
	return context;
};

interface ManageTagsModalProviderProps extends PropsWithChildren {
	onTagsUpdated?: () => void;
}

export const ManageTagsModalProvider: FC<ManageTagsModalProviderProps> = ({
	children,
	onTagsUpdated,
}) => {
	const {
		isOpen: isModalOpen,
		data: selectedClient,
		open: openModal,
		close: closeModal,
	} = useModalWithData<IClient>();

	const value = useMemo(
		() => ({
			openModal,
			closeModal,
		}),
		[openModal, closeModal]
	);

	return (
		<ManageTagsModalContext.Provider value={value}>
			{children}
			{selectedClient && (
				<ManageTagsModal
					isOpen={isModalOpen}
					onClose={closeModal}
					clientId={selectedClient.id || ""}
					onTagsUpdated={onTagsUpdated}
				/>
			)}
		</ManageTagsModalContext.Provider>
	);
};
