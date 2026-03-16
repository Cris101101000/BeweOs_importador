import {
	Button,
	Chip,
	type ChipColor,
	IconComponent,
	Tooltip,
} from "@beweco/aurora-ui";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { IField } from "@clients/domain/interfaces/field.interface";
import type { ColumnsKey } from "../interfaces";
import { CopyPhoneModal } from "@clients/ui/features/contact-details/components/copy-phone-modal";
import { useCreateNoteModal } from "@clients/ui/_shared/contexts/create-note-modal.context";
import { useManageTagsModal } from "@clients/ui/_shared/contexts/manage-tags-modal.context";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import { getClientFullName } from "@clients/domain/utils/client-name.utils";
import { getCreationChannelTranslate } from "@shared/domain/utils/creation-channel-translate.utils";
import { getGenderTranslate } from "@shared/domain/utils/gender-translate.utils";
import { isMobileDevice, redirectToWhatsApp } from "@shared/utils";
import {
	formatCompletePhoneNumber,
	initiatePhoneCall,
} from "@shared/utils/phone-formatter.utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useState } from "react";
import type { FC } from "react";
import type React from "react";
import { AiTagsCell } from "./ai-tags-cell.component";
import { DynamicTableCell } from "./dynamic-table-cell.component";

interface ClientTableRowProps {
	client: IClient;
	columnKey: React.Key;
	fields: IField[];
}

/**
 * Component that renders a single table cell for a client row
 * Handles special cases and uses DynamicTableCell for standard cases
 */
export const ClientTableRow: FC<ClientTableRowProps> = ({
	client,
	columnKey,
	fields,
}) => {
	const { t } = useTranslate();
	const { openModal: openCreateNoteModal } = useCreateNoteModal();
	const { openModal: openManageTagsModal } = useManageTagsModal();
	const cellKey = columnKey as ColumnsKey;

	// State for copy phone modal
	const [isCopyPhoneModalOpen, setIsCopyPhoneModalOpen] = useState(false);

	// Find the field configuration for this column
	const field = fields.find((f) => f.key === cellKey);

	/**
	 * Handles phone call action based on device type
	 * Mobile: Initiates direct call
	 * Desktop: Shows copy phone modal
	 */
	const handlePhoneCall = useCallback(() => {
		const primaryPhone = client.phones?.[0];

		if (!primaryPhone?.number) {
			console.warn(
				"No phone number available for client:",
				getClientFullName(client)
			);
			return;
		}

		if (isMobileDevice()) {
			// On mobile devices, initiate direct call
			const fullPhoneNumber = formatCompletePhoneNumber(
				primaryPhone.code,
				primaryPhone.number
			);
			const callInitiated = initiatePhoneCall(fullPhoneNumber);

			// If call couldn't be initiated on mobile, fallback to copy modal
			if (!callInitiated) {
				setIsCopyPhoneModalOpen(true);
			}
		} else {
			// On desktop, show copy modal
			setIsCopyPhoneModalOpen(true);
		}
	}, [client.phones, client.firstName, client.lastName]);

	/**
	 * Closes the copy phone modal
	 */
	const handleCloseCopyPhoneModal = useCallback(() => {
		setIsCopyPhoneModalOpen(false);
	}, []);

	// Render the cell content
	const renderCellContent = () => {
		switch (cellKey) {
			case "contact":
				return (
					<div className="flex flex-col whitespace-nowrap min-w-max">
						<span className="font-medium text-default-900">
							{getClientFullName(client)}
						</span>
						<span className="text-sm text-default-500">
							{client.bussines}
						</span>
					</div>
				);
			case "phone":
				return (
					<span className="text-sm text-default-600">
						{client.phones?.[0]
							? formatCompletePhoneNumber(
									client.phones[0].code,
									client.phones[0].number
								)
							: "-"}
					</span>
				);
			case "status":
				return (
					<Chip
						size="sm"
						color={client.status.color as ChipColor}
						variant="flat"
						className="capitalize"
						radius="sm"
					>
						{t(STATUS_CLIENT[client.status.translationKey].translationKey)}
					</Chip>
				);
			case "potency":
				return (
					<div>
						{client.potential ? (
							<Chip
								size="sm"
								color={client.potential?.color as ChipColor}
								variant="flat"
								radius="sm"
							>
								{t(client.potential?.translationKey || "potential_unknown")}
							</Chip>
						) : (
							<span className="text-sm text-default-600">-</span>
						)}
					</div>
				);
			case "gender":
				return (
					<span className="text-sm text-default-600">
						{client.gender ? getGenderTranslate(client.gender, t) : "-"}
					</span>
				);
			case "created_channel":
				return (
					<span className="text-sm text-default-600">
						{client.createdChannel
							? getCreationChannelTranslate(client.createdChannel, t)
							: "-"}
					</span>
				);

			case "ai_tags":
				return (
					<AiTagsCell
						tags={client.tags}
						onEdit={() => openManageTagsModal(client)}
					/>
				);

			case "quick_actions":
				return (
					<div className="flex items-center justify-start gap-1">
						<Tooltip
							content={t(
								"tooltip_send_whatsapp",
								"Escribe un mensaje en WhatsApp"
							)}
						>
							<Button
								variant="light"
								color="default"
								size="sm"
								isIconOnly
								startContent={
									<IconComponent
										className="text-default-600"
										icon="ic:twotone-whatsapp"
									/>
								}
								className="min-w-2 w-auto h-auto"
								onPress={() => {
									const primaryPhone = client.phones?.[0];
									if (primaryPhone) {
										const fullPhoneNumber = `${primaryPhone.code}${primaryPhone.number}`;
										redirectToWhatsApp(fullPhoneNumber);
									}
								}}
								isDisabled={!client.phones?.[0]?.number}
							/>
						</Tooltip>
						<Tooltip
							content={
								isMobileDevice()
									? t("call_client_mobile", "Llama al cliente")
									: t("copy_client_phone", "Copiar teléfono del cliente")
							}
						>
							<Button
								variant="light"
								color="default"
								size="sm"
								isIconOnly
								startContent={
									<IconComponent
										className="text-default-600"
										icon="solar:phone-calling-outline"
									/>
								}
								className="min-w-2 w-auto h-auto"
								onPress={handlePhoneCall}
								isDisabled={!client.phones?.[0]?.number}
							/>
						</Tooltip>
						<Tooltip content={t("tooltip_create_note", "Crea una nueva nota")}>
							<Button
								variant="light"
								color="secondary"
								size="sm"
								isIconOnly
								startContent={<IconComponent icon="solar:file-outline" />}
								className="min-w-2 w-auto h-auto"
								onPress={() => openCreateNoteModal(client)}
							/>
						</Tooltip>
					</div>
				);
			default:
				// Use dynamic cell renderer for all other cases
				if (field?.dataType) {
					return (
						<DynamicTableCell
							client={client}
							fieldKey={cellKey}
							dataType={field.dataType}
						/>
					);
				}

				// Fallback for unknown fields
				return <span className="text-sm text-default-600">-</span>;
		}
	};

	return (
		<>
			{renderCellContent()}
			{/* Copy Phone Modal - rendered once per row */}
			<CopyPhoneModal
				isOpen={isCopyPhoneModalOpen}
				onClose={handleCloseCopyPhoneModal}
				phoneCode={client.phones?.[0]?.code}
				phoneNumber={client.phones?.[0]?.number}
				clientName={getClientFullName(client)}
			/>
		</>
	);
};
