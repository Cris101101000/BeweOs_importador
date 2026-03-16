import {
	Button,
	H4,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
} from "@beweco/aurora-ui";
import { useAuraToast } from "@beweco/aurora-ui";
import { copyToClipboard } from "@shared/utils/clipboard.utils";
import { formatCompletePhoneNumber } from "@shared/utils/phone-formatter.utils";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

interface CopyPhoneModalProps {
	isOpen: boolean;
	onClose: () => void;
	phoneCode?: string;
	phoneNumber?: string;
	clientName?: string;
}

/**
 * Modal component for copying phone numbers to clipboard
 * Displays formatted phone number with copy functionality
 */
export const CopyPhoneModal: FC<CopyPhoneModalProps> = ({
	isOpen,
	onClose,
	phoneCode,
	phoneNumber,
	clientName,
}) => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();

	// Format the complete phone number for display
	const formattedPhone =
		phoneCode && phoneNumber
			? formatCompletePhoneNumber(phoneCode, phoneNumber)
			: phoneNumber || "";

	/**
	 * Copies the phone number to clipboard
	 */
	const handleCopyPhone = async () => {
		if (!formattedPhone) {
			return;
		}

		const result = await copyToClipboard(formattedPhone, true);
		if (result.success) {
			showToast({
				color: "success",
				title: t("copied_phone", "Teléfono copiado"),
				description: result.value,
			});
		} else {
			showToast({
				color: "danger",
				title: t("copy_failed", "No se pudo copiar"),
			});
		}

		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
			<ModalContent className="flex flex-col gap-2">
				<ModalHeader className="flex flex-col gap-1 p-0">
					{t("copy_phone_modal_title", "Copiar teléfono")}
				</ModalHeader>
				<ModalBody className="p-0">
					<div className="flex flex-col gap-2">
						{clientName && (
							<div className="flex flex-row items-center gap-1">
								<H4>{t("copy_phone_modal_client", "Cliente")}:</H4>
								<P> {clientName}</P>
							</div>
						)}
						<div className="flex flex-col gap-1">
							<H4>{t("copy_phone_modal_phone_label", "Teléfono")}:</H4>
							<div className="p-3 bg-default-100 rounded-lg">
								<P className=" text-small text-center">
									{formattedPhone ||
										t("copy_phone_modal_no_phone", "Sin teléfono")}
								</P>
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter className="flex gap-2 p-0 mt-4">
					<Button
						className="flex-1"
						color="default"
						variant="flat"
						onPress={onClose}
					>
						{t("copy_phone_modal_cancel", "Cancelar")}
					</Button>
					<Button
						className="flex-1"
						color="primary"
						onPress={handleCopyPhone}
						isDisabled={!formattedPhone}
					>
						{t("copy_phone_modal_copy", "Copiar")}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
