import { useAuraToast } from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

interface NoteFormData {
	title: string;
	description: string;
}

interface UseNoteFormProps {
	isOpen: boolean;
	onSubmit: (data: NoteFormData) => Promise<void>;
	initialData?: {
		title: string;
		description: string;
	} | null;
	isEditMode?: boolean;
}

export const useNoteForm = ({
	isOpen,
	onSubmit,
	initialData,
	isEditMode = false,
}: UseNoteFormProps) => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid, touchedFields },
		reset,
		trigger,
	} = useForm<NoteFormData>({
		mode: "onTouched",
		defaultValues: {
			title: "",
			description: "",
		},
	});

	// Reset form when modal opens with data
	useEffect(() => {
		if (isOpen) {
			const title = initialData?.title || "";
			const description = initialData?.description || "";
			reset({ title, description });
		}
	}, [isOpen, initialData?.title, initialData?.description, reset]);

	// Handle form submission with toast notifications
	const handleFormSubmit = useCallback(
		async (data: NoteFormData) => {
			try {
				await onSubmit(data);

				// Show success toast
				showToast(
					configureSuccessToast(
						t(isEditMode ? "note_updated_success" : "note_created_success")
					)
				);
			} catch (error) {
				// Show error toast
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						t(isEditMode ? "error_updating_note" : "error_creating_note")
					)
				);
			}
		},
		[onSubmit, showToast, t, isEditMode]
	);

	// Reset form data
	const resetForm = useCallback(() => {
		reset({
			title: "",
			description: "",
		});
	}, [reset]);

	return {
		control,
		handleSubmit: handleSubmit(handleFormSubmit),
		errors,
		touchedFields,
		isValid,
		trigger,
		resetForm,
	};
};
