import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
	Textarea,
} from "@beweco/aurora-ui";
import type { INote } from "@clients/domain/interfaces/note.interface";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback } from "react";
import { Controller } from "react-hook-form";
import { useNoteForm } from "./hooks/use-note-form.hook";

interface CreateNoteModalProps {
	isOpen: boolean;
	onClose: () => void;
	clientName: string;
	onSave: (noteData: { title: string; description: string }) => Promise<void>;
	note?: INote | null;
	isLoading?: boolean;
}

export const CreateNoteModal: FC<CreateNoteModalProps> = ({
	isOpen,
	onClose,
	clientName,
	onSave,
	note,
	isLoading = false,
}) => {
	const { t } = useTranslate();
	const isEditMode = !!note;

	const { control, handleSubmit, errors, touchedFields, isValid, resetForm } =
		useNoteForm({
			isOpen,
			onSubmit: async (noteData) => {
				await onSave(noteData);
			},
			initialData: note
				? { title: note.title, description: note.description }
				: null,
			isEditMode: isEditMode,
		});

	const handleClose = useCallback(() => {
		if (!isEditMode) {
			resetForm();
		}
		onClose();
	}, [isEditMode, resetForm, onClose]);

	return (
		<Modal
			key={note?.id || "new"}
			isOpen={isOpen}
			onClose={handleClose}
			size="md"
			placement="center"
			isDismissable={!isLoading}
			hideCloseButton={isLoading}
			aria-labelledby="note-modal-title"
			aria-describedby="note-modal-description"
		>
			<ModalContent aria-busy={isLoading}>
				<form onSubmit={handleSubmit}>
					<ModalHeader className="flex flex-col gap-1 p-0">
						<div id="note-modal-title">
							{isEditMode
								? t("edit_note_modal_title", "Editar nota")
								: t("create_note_modal_title", "Añadir una nota")}
						</div>
					</ModalHeader>
					<ModalBody className="p-0">
						<P id="note-modal-description">
							{isEditMode
								? t(
										"edit_note_modal_description",
										"Modifica los detalles de la nota"
									)
								: t(
										"create_note_modal_description",
										"Ingresa una nota específica para este contacto"
									)}
							: {clientName}
						</P>
						<div className="flex flex-col gap-4 mt-4">
							<Controller
								name="title"
								control={control}
								rules={{
									required: {
										value: true,
										message: t(
											"validation_required",
											"Este campo es requerido"
										),
									},
									minLength: {
										value: 2,
										message: t("validation_min_length", {
											count: 2,
											defaultValue: "Mínimo 2 caracteres",
										}),
									},
									maxLength: {
										value: 100,
										message: t("validation_max_length", {
											count: 100,
											defaultValue: "Máximo 100 caracteres",
										}),
									},
								}}
								render={({ field }) => (
									<Input
										{...field}
										label={t("note_modal_title_label", "Título")}
										placeholder={t(
											"note_modal_title_placeholder",
											"Escribe un título para la nota"
										)}
										isRequired
										isDisabled={isLoading}
										isInvalid={!!(errors.title && touchedFields.title)}
										errorMessage={
											touchedFields.title ? errors.title?.message : undefined
										}
										variant="bordered"
									/>
								)}
							/>
							<Controller
								name="description"
								control={control}
								rules={{
									required: {
										value: true,
										message: t(
											"validation_required",
											"Este campo es requerido"
										),
									},
									minLength: {
										value: 5,
										message: t("validation_min_length", {
											count: 5,
											defaultValue: "Mínimo 5 caracteres",
										}),
									},
									maxLength: {
										value: 500,
										message: t("validation_max_length", {
											count: 500,
											defaultValue: "Máximo 500 caracteres",
										}),
									},
								}}
								render={({ field }) => (
									<Textarea
										{...field}
										label={t("note_modal_description_label", "Descripción")}
										placeholder={t(
											"note_modal_description_placeholder",
											"Describe los detalles de la nota"
										)}
										isRequired
										isDisabled={isLoading}
										isInvalid={
											!!(errors.description && touchedFields.description)
										}
										errorMessage={
											touchedFields.description
												? errors.description?.message
												: undefined
										}
										variant="bordered"
									/>
								)}
							/>
						</div>
					</ModalBody>
					<ModalFooter className="flex gap-2 p-0 mt-4">
						<Button
							color="default"
							variant="flat"
							onPress={handleClose}
							className="flex-1"
							isDisabled={isLoading}
						>
							{t("note_modal_cancel", "Cancelar")}
						</Button>
						<Button
							color="primary"
							className="flex-1"
							type="submit"
							isDisabled={!isValid || isLoading}
							isLoading={isLoading}
						>
							{isEditMode
								? t("note_modal_update", "Actualizar")
								: t("note_modal_save", "Guardar")}
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};
