import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { useEffect, useState } from "react";
import { DEFAULT_QUICK_START_ICON } from "../../../../../domain/quick-starts/constants";
import { IconSelector } from "../icon-selector";

interface EditQuickStartModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { text: string; icon: string }) => Promise<void>;
	isSubmitting?: boolean;
	initialData?: {
		text: string;
		icon: string;
	} | null;
}

export const EditQuickStartModal = ({
	isOpen,
	onClose,
	onSubmit,
	isSubmitting = false,
	initialData,
}: EditQuickStartModalProps) => {
	const { t } = useTranslate();
	const [formText, setFormText] = useState("");
	const [formIcon, setFormIcon] = useState<string>(DEFAULT_QUICK_START_ICON);

	// Sync form with initial data when modal opens
	useEffect(() => {
		if (initialData) {
			setFormText(initialData.text);
			setFormIcon(initialData.icon);
		}
	}, [initialData]);

	const resetForm = () => {
		setFormText("");
		setFormIcon(DEFAULT_QUICK_START_ICON);
	};

	const handleClose = () => {
		onClose();
		resetForm();
	};

	const handleSubmit = async () => {
		await onSubmit({ text: formText, icon: formIcon });
		resetForm();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="lg"
			placement="center"
			hideCloseButton
			scrollBehavior="inside"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-row items-center gap-2">
							<span>{t("linda_quick_starts_edit_modal_title")}</span>
						</ModalHeader>
						<ModalBody>
							<form
								className="flex flex-col gap-4"
								onSubmit={(e) => e.preventDefault()}
								noValidate
							>
								<Input
									label={t("linda_quick_starts_button_text_label")}
									placeholder={t("linda_quick_starts_button_text_placeholder")}
									value={formText}
									onChange={(e) => setFormText(e.target.value)}
									description={t("linda_quick_starts_button_text_description")}
									isRequired
								/>

								<IconSelector
									selectedIcon={formIcon}
									onIconSelect={setFormIcon}
								/>
							</form>
						</ModalBody>
						<ModalFooter>
							<Button
								color="default"
								variant="flat"
								onPress={handleClose}
								className="flex-1"
								isDisabled={isSubmitting}
							>
								{t("button_cancel")}
							</Button>
							<Button
								color="primary"
								onPress={handleSubmit}
								className="flex-1"
								isLoading={isSubmitting}
							>
								{t("button_save_changes")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
