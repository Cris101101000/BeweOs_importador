import {
	Button,
	H3,
	IconComponent,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";

interface DeleteUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

/**
 * Renders a confirmation modal for deleting a user, with a design
 * that matches the provided image.
 */
export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	const { t } = useTranslate();

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose} size="sm">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col items-center justify-center p-0">
							<IconComponent
								icon="solar:danger-triangle-bold"
								className="text-danger-500 h-12 w-12"
								size="xl"
							/>
						</ModalHeader>
						<ModalBody className="text-center p-0 gap-2">
							<H3>{t("settings_users_delete_title")}</H3>
							<P>{t("settings_users_delete_confirmation")}</P>
						</ModalBody>
						<ModalFooter className="!pt-6">
							<Button
								color="danger"
								fullWidth
								onPress={onConfirm}
								size="sm"
								startContent={
									<IconComponent icon="solar:trash-bin-minimalistic-outline" />
								}
							>
								{t("button_delete_user")}
							</Button>
							<Button
								fullWidth
								variant="flat"
								onPress={onClose}
								color="default"
								size="sm"
							>
								{t("button_cancel")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
