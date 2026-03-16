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
import type { FC } from "react";

interface ConfirmDeleteModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	itemName?: string;
	isLoading?: boolean;
}

export const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	itemName,
	isLoading = false,
}) => {
	const { t } = useTranslate();

	return (
		<Modal isOpen={isOpen} onClose={onClose} placement="center" size="sm">
			<ModalContent>
				<>
					<ModalHeader className="flex flex-col gap-2 p-0">
						<div className="flex flex-col items-center">
							<IconComponent
								icon="solar:danger-triangle-bold"
								className="text-danger-500 h-12 w-12"
								size="xl"
							/>
							<H3>{title}</H3>
						</div>
					</ModalHeader>
					<ModalBody className="p-0 gap-1 !not-sr-only !pt-2">
						<P className="text-default-600">{description}</P>
						{itemName && (
							<P className="text-default-700">
								{t("confirm_delete_item_name", {
									name: itemName,
									defaultValue: `Se eliminará: ${itemName}`,
								})}
							</P>
						)}
					</ModalBody>
					<ModalFooter className=" gap-2 p-0 !pt-6 ">
						<Button
							color="default"
							variant="flat"
							onPress={onClose}
							isDisabled={isLoading}
							size="sm"
							className="flex-1"
						>
							{t("button_cancel", "Cancelar")}
						</Button>
						<Button
							color="danger"
							onPress={onConfirm}
							isLoading={isLoading}
							size="sm"
							className="flex-1"
							startContent={
								!isLoading && (
									<IconComponent icon="solar:trash-bin-minimalistic-outline" />
								)
							}
						>
							{t("button_delete", "Eliminar")}
						</Button>
					</ModalFooter>
				</>
			</ModalContent>
		</Modal>
	);
};
