import { useAuraToast } from "@beweco/aurora-ui";
import { CreateClientUseCase } from "@clients/application/create-client.usecase";
import type { IFastClient } from "@clients/domain/interfaces/client.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { transformFastClientToClient } from "@layout/domain/utils/clients.utils";
import type { EnumErrorType } from "@shared/domain/enums";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { FC, PropsWithChildren } from "react";
import { QuickContactModal } from "../components/quick-contact-modal/quick-contact-modal.component";
import { useSession } from "@shared/ui/contexts/session-context/session-context";

interface QuickContactModalContextValue {
	openModal: (onSuccess?: () => void) => void;
	closeModal: () => void;
	isCreating: boolean;
}

const QuickContactModalContext = createContext<
	QuickContactModalContextValue | undefined
>(undefined);

export const useQuickContactModal = () => {
	const context = useContext(QuickContactModalContext);
	if (!context) {
		throw new Error(
			"useQuickContactModal must be used within a QuickContactModalProvider"
		);
	}
	return context;
};

export const QuickContactModalProvider: FC<PropsWithChildren> = ({
	children,
}) => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const { agency } = useSession();
	const companyId = agency?.id;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [onSuccessCallback, setOnSuccessCallback] = useState<
		(() => void) | null
	>(null);

	const openModal = useCallback((onSuccess?: () => void) => {
		setOnSuccessCallback(() => onSuccess || null);
		setIsModalOpen(true);
	}, []);

	const closeModal = useCallback(() => {
		setIsModalOpen(false);
		setOnSuccessCallback(null);
	}, []);

	/**
	 * Handle contact creation using the use case
	 */
	const handleSaveContact = useCallback(
		async (data: IFastClient) => {
			setIsCreating(true);

			try {
				// Transform to client model using utility function
				const clientData = transformFastClientToClient(data);

				// Create use case instance
				const clientAdapter = new ClientAdapter();
				const createClientUseCase = new CreateClientUseCase(clientAdapter);

				// Execute creation
				await createClientUseCase.execute(clientData, companyId || "");

				// Show success message
				showToast(
					configureSuccessToast(
						t("quick_contact_success", "Contacto creado exitosamente")
					)
				);

				onSuccessCallback?.();

				closeModal();
			} catch (error) {
				if (error instanceof Error) {
					showToast(
						configureErrorToastWithTranslation(
							error.message as EnumErrorType,
							t
						)
					);
				}
			} finally {
				setIsCreating(false);
			}
		},
		[showToast, t, closeModal, companyId, onSuccessCallback]
	);

	const value = useMemo(
		() => ({
			openModal,
			closeModal,
			isCreating,
		}),
		[openModal, closeModal, isCreating]
	);

	return (
		<QuickContactModalContext.Provider value={value}>
			{children}
			<QuickContactModal
				isOpen={isModalOpen}
				onClose={closeModal}
				onSave={handleSaveContact}
				isLoading={isCreating}
			/>
		</QuickContactModalContext.Provider>
	);
};
