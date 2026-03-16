import { Button, Chip, IconComponent, P } from "@beweco/aurora-ui";
import { HISTORY_CONFIG } from "@clients/domain/constants/history.constants";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { INote } from "@clients/domain/interfaces/note.interface";
import { getClientFullName } from "@clients/domain/utils/client-name.utils";
import { useCreateNoteModal } from "@clients/ui/_shared/contexts/create-note-modal.context";
import { useDeleteModals } from "@clients/ui/_shared/hooks/use-delete-modals.hook";
import { useClientNotes } from "@clients/ui/features/contact-details/hooks/use-client-notes.hook";
import { useHistoryActions } from "@clients/ui/features/contact-details/hooks/use-history-actions.hook";
import { EmptyState, ErrorState, LoadingState } from "@clients/ui/features/contact-details/components/list-states";
import {
	AccordionListComponent,
	type BaseAccordionItem,
} from "@shared/ui/components";
import { ConfirmDeleteModal } from "@shared/ui/components/confirm-delete-modal/confirm-delete-modal";
import { formatDateObjectToDisplay } from "@shared/utils/date-formatter.utils";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useEffect, useRef } from "react";

/** Nota con forma compatible con AccordionList (BaseAccordionItem). */
type NoteAccordionItem = INote & BaseAccordionItem;

export interface NotesTabProps {
	client: IClient;
}

/**
 * Contenido del tab "Historial de notas": lista, alta y eliminación.
 */
export const NotesTab: FC<NotesTabProps> = ({ client }) => {
	const { t } = useTranslate();
	const {
		openModal: openNoteModal,
		openEditModal: openEditNoteModal,
		registerRefreshCallback: registerNotesRefreshCallback,
	} = useCreateNoteModal();

	const {
		notes,
		total: totalNotes,
		limit: notesLimit,
		offset: notesOffset,
		isLoading: isLoadingNotes,
		error: notesError,
		refetch: refetchNotes,
		goToPage,
	} = useClientNotes(client.id ?? null, true);

	const {
		deleteNoteModal,
		openDeleteNoteModal,
		closeDeleteNoteModal,
		setDeleteNoteLoading,
	} = useDeleteModals();

	const { handleConfirmDeleteNote } = useHistoryActions({
		setDeleteNoteLoading,
		setDeleteCommunicationLoading: () => {},
		closeDeleteNoteModal,
		closeDeleteCommunicationModal: () => {},
		refetchAll: refetchNotes,
		clientId: client.id ?? "",
	});

	const refetchRef = useRef(refetchNotes);
	refetchRef.current = refetchNotes;
	useEffect(() => {
		const cb = async () => {
			await refetchRef.current();
		};
		registerNotesRefreshCallback(cb);
	}, [registerNotesRefreshCallback]);

	const handleCreateNote = useCallback(() => {
		openNoteModal(client);
	}, [openNoteModal, client]);

	const handleEditNote = useCallback(
		(selectedClient: IClient, note: INote) => {
			openEditNoteModal(selectedClient, note);
		},
		[openEditNoteModal]
	);

	const confirmDeleteHandler = useCallback(() => {
		return handleConfirmDeleteNote(deleteNoteModal.item);
	}, [handleConfirmDeleteNote, deleteNoteModal.item]);

	const totalPages = Math.ceil(totalNotes / notesLimit) || 1;
	const currentPage = Math.floor(notesOffset / notesLimit) + 1;

	const handlePageChange = useCallback(
		(nextPage: number) => {
			const nextOffset = (nextPage - 1) * notesLimit;
			goToPage(nextOffset);
		},
		[goToPage, notesLimit]
	);

	const accordionPagination =
		totalNotes > notesLimit && !notesError
			? {
					currentPage,
					totalPages,
					onPageChange: handlePageChange,
					showControls: true,
					isCompact: true,
				}
			: undefined;

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div>
						<P>
							{t(
								"notes_history_description",
								"Registro completo de todas las interacciones con"
							)}{" "}
							{getClientFullName(client)}
						</P>
					</div>
					<Button color="primary" size="sm" onPress={handleCreateNote}>
						{t("new_note", "Nueva nota")}
					</Button>
				</div>

				<div className="flex flex-col gap-3">
					{isLoadingNotes ? (
						<LoadingState />
					) : notesError ? (
						<ErrorState
							errorKey="error_loading_notes"
							defaultMessage="Error al cargar notas"
							onRetry={refetchNotes}
						/>
					) : notes.length > 0 ? (
						<>
							<div className="mb-4 flex items-center gap-2">
								<IconComponent
									icon={HISTORY_CONFIG.icons.notesEmpty}
									className="w-5 h-5 text-violet-600 dark:text-violet-400"
								/>
								<h3 className="text-base font-semibold text-foreground">
									{t("notes_total_title", "Total de notas")}
								</h3>
								<Chip size="sm" variant="flat" color="secondary">
									{totalNotes}
								</Chip>
							</div>
							<AccordionListComponent<NoteAccordionItem>
								mode="accordion"
								items={notes as NoteAccordionItem[]}
								accordionVariant="splitted"
								header={{
								getTitle: (note) => note.title,
								getSubtitle: (note) =>
									note.description.length > 80
										? `${note.description.slice(0, 80)}...`
										: note.description,
								getMetadata: (note) => {
									const metadata: Array<{
										key: string;
										label: string;
										color: "default" | "primary" | "secondary";
										variant: "flat";
									}> = [];
									if (note.createdBy) {
										metadata.push({
											key: "author",
											label: note.createdBy,
											color: "secondary",
											variant: "flat",
										});
									}
									metadata.push({
										key: "date",
										label: formatDateObjectToDisplay(note.createdAt),
										color: "default",
										variant: "flat",
									});
									return metadata;
								},
							}}
							content={{
								render: (note) => (
									<P className="text-sm text-default-700 whitespace-pre-wrap leading-relaxed">
										{note.description}
									</P>
								),
							}}
							actions={[
								{
									key: "edit",
									icon: HISTORY_CONFIG.icons.edit,
									tooltip: t("tooltip_edit_note", "Editar nota"),
									color: "default",
									onPress: (note) => handleEditNote(client, note),
								},
								{
									key: "delete",
									icon: HISTORY_CONFIG.icons.delete,
									tooltip: t("tooltip_delete_note", "Eliminar nota"),
									color: "danger",
									onPress: (note) => openDeleteNoteModal(note),
								},
							]}
								pagination={accordionPagination}
							/>
						</>
					) : (
						<EmptyState
							icon={HISTORY_CONFIG.icons.notesEmpty}
							title="no_notes"
							description="create_first_note"
							buttonText="create_note"
							onAction={handleCreateNote}
						/>
					)}
				</div>
			</div>

			<ConfirmDeleteModal
				isOpen={deleteNoteModal.isOpen}
				onClose={closeDeleteNoteModal}
				onConfirm={confirmDeleteHandler}
				title={t("delete_note_title", "¿Quieres eliminar esta nota?")}
				description={t(
					"delete_note_description",
					"Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta nota?"
				)}
				itemName={deleteNoteModal.item?.title}
				isLoading={deleteNoteModal.isLoading}
			/>
		</>
	);
};
