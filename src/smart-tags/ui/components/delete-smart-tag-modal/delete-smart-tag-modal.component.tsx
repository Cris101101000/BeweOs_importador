import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { ISmartTag } from "../../../domain/interfaces/smart-tags-interface.ts";

interface DeleteSmartTagModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	tag: ISmartTag | null;
	isLoading?: boolean;
}

export const DeleteSmartTagModal = ({
	isOpen,
	onClose,
	onConfirm,
	tag,
	isLoading = false,
}: DeleteSmartTagModalProps) => {
	const { t } = useTranslate();

	const handleConfirm = async () => {
		await onConfirm();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="sm">
			<ModalContent>
				<ModalHeader>
					{t("smart_tags_delete_modal_title", "Confirmar eliminación")}
				</ModalHeader>
				<ModalBody>
					<p className="text-sm text-gray-900">
						{t(
							"smart_tags_delete_modal_description",
							"¿Estás seguro de que quieres eliminar esta etiqueta?"
						)}
					</p>
					{tag && (
						<p className="text-sm text-gray-600 font-medium mt-2">{tag.name}</p>
					)}
				</ModalBody>
				<ModalFooter>
					<Button variant="light" onPress={onClose} isDisabled={isLoading}>
						{t("button_cancel", "Cancelar")}
					</Button>
					<Button color="danger" onPress={handleConfirm} isLoading={isLoading}>
						{t("smart_tags_action_delete", "Eliminar")}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
