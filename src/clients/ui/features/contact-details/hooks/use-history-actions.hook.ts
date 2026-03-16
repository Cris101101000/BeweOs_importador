import { useAuraToast } from "@beweco/aurora-ui";
import { DeleteCommunicationUseCase } from "@clients/application/delete-communication.usecase";
import { DeleteNoteUseCase } from "@clients/application/delete-note.usecase";
import type { ICommunication } from "@clients/domain/interfaces/communication.interface";
import type { INote } from "@clients/domain/interfaces/note.interface";
import { ClientHistoryAdapter } from "@clients/infrastructure/adapters/client-history.adapter";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo } from "react";

interface UseHistoryActionsParams {
	setDeleteNoteLoading: (loading: boolean) => void;
	setDeleteCommunicationLoading: (loading: boolean) => void;
	closeDeleteNoteModal: () => void;
	closeDeleteCommunicationModal: () => void;
	refetchAll: () => Promise<void>;
	clientId: string;
}

interface UseHistoryActionsReturn {
	handleConfirmDeleteNote: (note: INote | null) => Promise<void>;
	handleConfirmDeleteCommunication: (
		communication: ICommunication | null
	) => Promise<void>;
}

/**
 * Custom hook to handle delete actions for notes and communications
 * Encapsulates the business logic for deletion processes
 */
export const useHistoryActions = ({
	setDeleteNoteLoading,
	setDeleteCommunicationLoading,
	closeDeleteNoteModal,
	closeDeleteCommunicationModal,
	refetchAll,
	clientId,
}: UseHistoryActionsParams): UseHistoryActionsReturn => {
	const { agency } = useSession();
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const companyId = agency?.id || "";

	// Initialize use cases with adapter
	const { deleteNoteUseCase, deleteCommunicationUseCase } = useMemo(() => {
		const clientHistoryAdapter = new ClientHistoryAdapter();
		return {
			deleteNoteUseCase: new DeleteNoteUseCase(clientHistoryAdapter),
			deleteCommunicationUseCase: new DeleteCommunicationUseCase(
				clientHistoryAdapter
			),
		};
	}, []);
	const handleConfirmDeleteNote = useCallback(
		async (note: INote | null) => {
			if (!note) return;

			try {
				setDeleteNoteLoading(true);

				await deleteNoteUseCase.execute(clientId, [note.id]);

				// Show success toast
				showToast(
					configureSuccessToast(
						t("note_deleted_success", "Nota eliminada exitosamente")
					)
				);

				await refetchAll();
				closeDeleteNoteModal();
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"note_delete_error"
					)
				);

				setDeleteNoteLoading(false);
			}
		},
		[
			clientId,
			setDeleteNoteLoading,
			closeDeleteNoteModal,
			refetchAll,
			deleteNoteUseCase,
			showToast,
			t,
		]
	);

	const handleConfirmDeleteCommunication = useCallback(
		async (communication: ICommunication | null) => {
			if (!communication) return;

			try {
				setDeleteCommunicationLoading(true);

				await deleteCommunicationUseCase.execute(
					communication.id,
					companyId,
					clientId
				);

				// Show success toast
				showToast(
					configureSuccessToast(
						t(
							"communication_deleted_success",
							"Comunicación eliminada exitosamente"
						)
					)
				);

				await refetchAll();
				closeDeleteCommunicationModal();
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"communication_delete_error"
					)
				);

				setDeleteCommunicationLoading(false);
			}
		},
		[
			setDeleteCommunicationLoading,
			closeDeleteCommunicationModal,
			refetchAll,
			deleteCommunicationUseCase,
			companyId,
			clientId,
			showToast,
			t,
		]
	);

	return {
		handleConfirmDeleteNote,
		handleConfirmDeleteCommunication,
	};
};
