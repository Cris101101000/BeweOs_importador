import { CreateNoteUseCase } from "@clients/application/create-note.usecase";
import { UpdateNoteUseCase } from "@clients/application/update-note.usecase";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { getClientFullName } from "@clients/domain/utils/client-name.utils";
import type { INote } from "@clients/domain/interfaces/note.interface";
import { ClientHistoryAdapter } from "@clients/infrastructure/adapters/client-history.adapter";
import { CreateNoteModal } from "@clients/ui/features/contact-details/components/create-note-modal/create-note-modal.component";
import { useModalWithData } from "@clients/ui/_shared/hooks/use-modal-state.hook";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import type { FC, PropsWithChildren } from "react";

// Type for modal data that includes both client and optional note for editing
interface NoteModalData {
	client: IClient;
	note?: INote;
}

interface CreateNoteModalContextValue {
	openModal: (client: IClient) => void;
	openEditModal: (client: IClient, note: INote) => void;
	closeModal: () => void;
	isLoading: boolean;
	saveNote: (noteData: { title: string; description: string }) => Promise<void>;
	registerRefreshCallback: (callback: () => Promise<void>) => void;
}

const CreateNoteModalContext = createContext<
	CreateNoteModalContextValue | undefined
>(undefined);

export const useCreateNoteModal = () => {
	const context = useContext(CreateNoteModalContext);
	if (!context) {
		throw new Error(
			"useCreateNoteModal must be used within a CreateNoteModalProvider"
		);
	}
	return context;
};

export const CreateNoteModalProvider: FC<PropsWithChildren> = ({
	children,
}) => {
	const { agency } = useSession();
	const {
		isOpen: isModalOpen,
		data: modalData,
		open: openModalWithData,
		close: closeModal,
	} = useModalWithData<NoteModalData>();
	const [isLoading, setIsLoading] = useState(false);
	const refreshCallbackRef = useRef<(() => Promise<void>) | null>(null);

	// Use cases instances
	const clientHistoryAdapter = useMemo(() => new ClientHistoryAdapter(), []);
	const createNoteUseCase = useMemo(
		() => new CreateNoteUseCase(clientHistoryAdapter),
		[clientHistoryAdapter]
	);
	const updateNoteUseCase = useMemo(
		() => new UpdateNoteUseCase(clientHistoryAdapter),
		[clientHistoryAdapter]
	);

	const openModal = useCallback(
		(client: IClient) => {
			openModalWithData({ client });
		},
		[openModalWithData]
	);

	const openEditModal = useCallback(
		(client: IClient, note: INote) => {
			openModalWithData({ client, note });
		},
		[openModalWithData]
	);

	const registerRefreshCallback = useCallback(
		(callback: () => Promise<void>) => {
			refreshCallbackRef.current = callback;
		},
		[]
	);

	const saveNote = useCallback(
		async (noteData: { title: string; description: string }) => {
			if (!modalData?.client || !agency?.id) {
				throw new Error("Missing required data");
			}

			const { client, note: selectedNote } = modalData;
			setIsLoading(true);

			try {
				if (selectedNote) {
					// Update existing note
					await updateNoteUseCase.execute(
						client.id || "",
						selectedNote.id,
						{
							title: noteData.title.trim(),
							description: noteData.description.trim(),
						}
					);
				} else {
					// Create new note
					await createNoteUseCase.execute({
						clientId: client.id || "",
						title: noteData.title.trim(),
						description: noteData.description.trim(),
						companyId: agency.id,
					});
				}

				// Trigger refresh callback
				if (
					refreshCallbackRef.current &&
					typeof refreshCallbackRef.current === "function"
				) {
					await refreshCallbackRef.current();
				}

				closeModal();
			} catch (error) {
				console.error("Error saving note:", error);
				// Re-throw the error so the form hook can handle the toast
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[modalData, agency?.id, createNoteUseCase, updateNoteUseCase, closeModal]
	);

	const value = useMemo(
		() => ({
			openModal,
			openEditModal,
			closeModal,
			isLoading,
			saveNote,
			registerRefreshCallback,
		}),
		[
			openModal,
			openEditModal,
			closeModal,
			isLoading,
			saveNote,
			registerRefreshCallback,
		]
	);

	return (
		<CreateNoteModalContext.Provider value={value}>
			{children}
			{modalData?.client && (
				<CreateNoteModal
					isOpen={isModalOpen}
					onClose={closeModal}
					clientName={getClientFullName(modalData.client)}
					onSave={saveNote}
					note={modalData.note || null}
					isLoading={isLoading}
				/>
			)}
		</CreateNoteModalContext.Provider>
	);
};
