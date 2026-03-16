import {
	Avatar,
	Button,
	Card,
	CardHeader,
	Chip,
	IconComponent,
	Input,
	P,
	Tooltip,
} from "@beweco/aurora-ui";
import type { ChipColor } from "@beweco/aurora-ui";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { getClientFullName } from "@clients/domain/utils/client-name.utils";
import { CopyPhoneModal } from "../copy-phone-modal";
import { useCreateNoteModal } from "@clients/ui/_shared/contexts/create-note-modal.context";
import { isMobileDevice, redirectToWhatsApp } from "@shared/utils";
import {
	formatCompletePhoneNumber,
	initiatePhoneCall,
} from "@shared/utils/phone-formatter.utils";
import { formatISODateForDisplay } from "@shared/utils/date-formatter.utils";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
export interface ClientInfoCardFormData {
	firstName: string;
	lastName: string;
	address: string;
}

interface ClientInfoCardProps {
	client: IClient;
	lastCommunicationDisplay: string;
	/** Guardado independiente de este card: solo envía firstName, lastName, address. */
	onSave?: (data: ClientInfoCardFormData) => void | Promise<void>;
	isSaving?: boolean;
}

/**
 * ClientInfoCard: perfil del cliente (avatar, nombre, email, última comunicación).
 * Nombres, Apellidos y Dirección siempre editables, prellenados con los datos del cliente.
 */
export const ClientInfoCard: FC<ClientInfoCardProps> = ({
	client,
	lastCommunicationDisplay,
	onSave,
	isSaving = false,
}) => {
	const { t } = useTranslate();
	const { openModal: openCreateNoteModal } = useCreateNoteModal();

	const [isCopyPhoneModalOpen, setIsCopyPhoneModalOpen] = useState(false);
	const primaryPhone = client.phones?.[0];

	const addressFromClient =
		client.formattedAddress ||
		(client.address
			? [client.address.address, client.address.city, client.address.zip, client.address.country]
					.filter(Boolean)
					.join(", ")
			: "");

	const [localFirstName, setLocalFirstName] = useState(client.firstName ?? "");
	const [localLastName, setLocalLastName] = useState(client.lastName ?? "");
	const [localAddress, setLocalAddress] = useState(addressFromClient);

	useEffect(() => {
		setLocalFirstName(client.firstName ?? "");
		setLocalLastName(client.lastName ?? "");
		setLocalAddress(
			client.formattedAddress ||
				(client.address
					? [client.address.address, client.address.city, client.address.zip, client.address.country]
							.filter(Boolean)
							.join(", ")
					: "")
		);
	}, [client.firstName, client.lastName, client.formattedAddress, client.address]);

	const handlePhoneCall = useCallback(() => {
		if (!primaryPhone?.number) {
			console.warn("No phone number available for client:", getClientFullName(client));
			return;
		}
		if (isMobileDevice()) {
			const fullPhoneNumber = formatCompletePhoneNumber(
				primaryPhone.code,
				primaryPhone.number
			);
			const callInitiated = initiatePhoneCall(fullPhoneNumber);
			if (!callInitiated) setIsCopyPhoneModalOpen(true);
		} else {
			setIsCopyPhoneModalOpen(true);
		}
	}, [client]);

	const handleWhatsApp = useCallback(() => {
		if (primaryPhone) {
			redirectToWhatsApp(`${primaryPhone.code}${primaryPhone.number}`);
		}
	}, [client]);

	const createdAtDisplay = client.createdAt
		? formatISODateForDisplay(client.createdAt)
		: "-";

	const hasLocalChanges =
		localFirstName !== (client.firstName ?? "") ||
		localLastName !== (client.lastName ?? "") ||
		localAddress !== addressFromClient;

	const [localErrors, setLocalErrors] = useState<{
		firstName?: string;
		lastName?: string;
	}>({});

	const handleSaveCard = useCallback(() => {
		const firstNameTrim = localFirstName.trim();
		const lastNameTrim = localLastName.trim();
		if (!firstNameTrim) {
			setLocalErrors((e) => ({ ...e, firstName: t("field_required", "Requerido") }));
			return;
		}
		if (!lastNameTrim) {
			setLocalErrors((e) => ({ ...e, lastName: t("field_required", "Requerido") }));
			return;
		}
		setLocalErrors({});
		onSave?.({
			firstName: firstNameTrim,
			lastName: lastNameTrim,
			address: localAddress.trim(),
		});
	}, [localFirstName, localLastName, localAddress, onSave, t]);

	return (
		<Card radius="sm" className="flex flex-col gap-4">
			<CardHeader className="p-0 flex xs:flex-col-reverse md:flex-row justify-between items-start xs:gap-2">
				{/* Profile-style: large avatar + name and email */}
				<div className="flex items-start gap-4">
					<Avatar
						src={client.avatarUrl}
						name={getClientFullName(client)}
						size="lg"
						color="primary"
						className="!w-[88px] !h-[88px] !min-w-[88px] !min-h-[88px] shrink-0"
					/>
					<div className="flex flex-col gap-1 min-w-0">
						<P className="font-semibold text-lg text-foreground truncate">
							{getClientFullName(client)}
						</P>
						{client.potential && (
							<Chip
								size="sm"
								color={client.potential?.color as ChipColor}
								variant="flat"
								radius="sm"
								className="w-fit"
							>
								{t(client.potential?.translationKey || "potential_unknown")}
							</Chip>
						)}
						<P className="text-default-500 text-sm truncate" title={client.email}>
							{client.email || "-"}
						</P>
						<div className="flex flex-row gap-1 items-center flex-wrap">
							<P className="text-default-500 text-sm">
								{t("clients_column_last_communication", "Última comunicación")}:
							</P>
							<P className="text-default-700 text-sm">{lastCommunicationDisplay}</P>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2 items-end xs:self-end md:self-start shrink-0">
					{/* Quick Actions */}
					<div className="flex items-center justify-end gap-1">
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
								onPress={handleWhatsApp}
								isDisabled={!primaryPhone?.number}
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
								isDisabled={!primaryPhone?.number}
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
				</div>
			</CardHeader>

			{/* Nombres, Apellidos, Dirección: editables y prellenados; guardado independiente de este card */}
			<div className="flex flex-col gap-3">
				<Input
					label={t("field_first_name", "Nombres")}
					value={localFirstName}
					onValueChange={(v) => {
						setLocalFirstName(v);
						setLocalErrors((e) => (e.firstName ? { ...e, firstName: undefined } : e));
					}}
					placeholder="-"
					className="w-full"
					isInvalid={!!localErrors.firstName}
					errorMessage={localErrors.firstName}
				/>
				<Input
					label={t("field_last_name", "Apellidos")}
					value={localLastName}
					onValueChange={(v) => {
						setLocalLastName(v);
						setLocalErrors((e) => (e.lastName ? { ...e, lastName: undefined } : e));
					}}
					placeholder="-"
					className="w-full"
					isInvalid={!!localErrors.lastName}
					errorMessage={localErrors.lastName}
				/>
				<Input
					label={t("clients_column_address", "Dirección")}
					value={localAddress}
					onValueChange={setLocalAddress}
					placeholder="-"
					className="w-full"
				/>
			</div>

			{/* Fecha de creación */}
			<div className="flex flex-col gap-0.5">
				<P className="text-tiny text-default-500">
					{t("clients_column_created_at", "Fecha de creación")}
				</P>
				<P className="text-default-700 text-sm">{createdAtDisplay}</P>
			</div>

			{onSave && (
				<div className="flex flex-row justify-end">
					<Button
						color="primary"
						size="sm"
						onPress={handleSaveCard}
						isDisabled={!hasLocalChanges || isSaving}
						isLoading={isSaving}
					>
						{t("button_save", "Guardar")}
					</Button>
				</div>
			)}

			{/* Copy Phone Modal */}
			<CopyPhoneModal
				isOpen={isCopyPhoneModalOpen}
				onClose={() => setIsCopyPhoneModalOpen(false)}
				phoneCode={primaryPhone?.code}
				phoneNumber={primaryPhone?.number}
				clientName={getClientFullName(client)}
			/>
		</Card>
	);
};
