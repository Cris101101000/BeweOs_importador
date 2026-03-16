import { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { EditContactFormData } from "../../types/edit-contact-form-data";
import { clientToEditContactFormData } from "../../types/edit-contact-form-data";
import { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import {
	convertDateToDateValue,
	convertStringToDateValue,
} from "@shared/utils/aurora-date.utils";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ClientInfoCard } from "../client-info-card/client-info-card.component";
import { ClientTagsCard } from "../client-tags-card";
import { PhonesCard } from "../phones-card";
import { OtherInfoCard } from "./other-info-card.component";

interface GeneralDataProps {
	client: IClient;
	onSave: (data: EditContactFormData) => void | Promise<void>;
	lastCommunicationDisplay: string;
	/** Increment to refresh tags in ClientTagsCard (e.g. after modal save) */
	tagsRefreshKey?: number;
}

/**
 * GeneralData: contenido del tab "Información Básica".
 * - ClientInfoCard (cardInfo): avatar, nombre, última comunicación, acciones.
 * - ClientTagsCard (etiquetas): etiquetas del cliente.
 * - OtherInfoCard: correo, estado, fecha de nacimiento, género.
 * - PhonesCard (telefonos): gestión de teléfonos.
 */
export const GeneralData: FC<GeneralDataProps> = ({
	client,
	onSave,
	lastCommunicationDisplay,
	tagsRefreshKey,
}) => {
	const [isSaving, setIsSaving] = useState(false);
	const [isCardSaving, setIsCardSaving] = useState(false);

	const getInitialBirthdate = (): any | undefined => {
		const value = client.birthdate;
		if (!value) return undefined;
		if (value.includes("/")) {
			return convertStringToDateValue(value);
		}
		try {
			const d = new Date(value);
			return convertDateToDateValue(d);
		} catch {
			return undefined;
		}
	};

	const getInitialAddress = () =>
		client.formattedAddress ||
		(client.address
			? [client.address.address, client.address.city, client.address.zip, client.address.country]
					.filter(Boolean)
					.join(", ")
			: "");

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty },
	} = useForm<EditContactFormData>({
		mode: "onChange",
		defaultValues: {
			firstName: client.firstName ?? "",
			lastName: client.lastName ?? "",
			address: getInitialAddress(),
			status: client.status.translationKey || EnumClientStatus.CLIENT,
			phones: client.phones ?? [],
			email: client.email || "",
			birthdate: getInitialBirthdate() ?? null,
			gender: client.gender ?? null,
			createdChannel: client.createdChannel || EnumCreationChannel.Web,
		},
	});

	useEffect(() => {
		reset({
			firstName: client.firstName ?? "",
			lastName: client.lastName ?? "",
			address: getInitialAddress(),
			status: client.status.translationKey || EnumClientStatus.CLIENT,
			phones: client.phones ?? [],
			email: client.email || "",
			birthdate: getInitialBirthdate() ?? null,
			gender: client.gender ?? null,
			createdChannel: client.createdChannel || EnumCreationChannel.Web,
		});
	}, [client, reset]);

	const onSubmitOtherInfo = handleSubmit(async (data) => {
		setIsSaving(true);
		try {
			await Promise.resolve(onSave(data));
		} finally {
			setIsSaving(false);
		}
	});

	const handleSaveCard = useCallback(
		async (cardData: { firstName: string; lastName: string; address: string }) => {
			setIsCardSaving(true);
			try {
				await Promise.resolve(
					onSave({
						...clientToEditContactFormData(client),
						...cardData,
					})
				);
			} finally {
				setIsCardSaving(false);
			}
		},
		[client, onSave]
	);

	const statusOptions = useMemo(
		() => Object.values(EnumClientStatus) as EnumClientStatus[],
		[]
	);

	return (
		<div className="flex flex-col gap-4">
			{/* Fila 1: Info cliente (cardInfo) | Etiquetas + Otra información */}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="w-full md:w-1/2 md:min-w-0">
				<ClientInfoCard
					client={client}
					lastCommunicationDisplay={lastCommunicationDisplay}
					onSave={handleSaveCard}
					isSaving={isCardSaving}
				/>
				</div>
				<div className="w-full md:w-1/2 md:min-w-0 flex flex-col gap-4">
					<ClientTagsCard client={client} tagsRefreshKey={tagsRefreshKey} />
					<OtherInfoCard
						control={control}
						errors={errors}
						onSubmit={onSubmitOtherInfo}
						isValid={isValid}
						isDirty={isDirty}
						isSaving={isSaving}
						statusOptions={statusOptions}
					/>
				</div>
			</div>

			{/* Fila 2: Teléfonos */}
			<div className="w-full">
				<PhonesCard client={client} onSave={onSave} />
			</div>
		</div>
	);
};
