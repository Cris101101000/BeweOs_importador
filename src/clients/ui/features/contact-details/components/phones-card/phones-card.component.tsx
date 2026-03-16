import {
	Button,
	Card,
	Checkbox,
	CheckboxGroup,
	Divider,
	IconComponent,
	Phone,
	Switch,
} from "@beweco/aurora-ui";
import {
	CLIENT_PHONE_TYPE_MAIN,
	CLIENT_PHONE_TYPE_OTHER,
	normalizeClientPhoneType,
} from "@clients/domain/constants/client-phone-type.constants";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { EditContactFormData } from "../../types/edit-contact-form-data";
import { clientToEditContactFormData } from "../../types/edit-contact-form-data";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

const defaultPhone = (type: "main" | "other"): IPhone => ({
	code: "+57",
	country: "CO",
	number: "",
	type,
	channels: ["phone", "whatsapp"],
});

/** Máximo 2 teléfonos: principal y otro. */
const MAX_PHONES = 2;

export interface PhonesCardFormData {
	phones: IPhone[];
	channelPhone: boolean;
	channelWhatsapp: boolean;
}

interface PhonesCardProps {
	client: IClient;
	onSave: (data: EditContactFormData) => void | Promise<void>;
}

const toPhoneValue = (phone?: IPhone | null) => ({
	code: phone?.code ?? "",
	number: phone?.number ?? "",
});

const toDomainPhone = (
	value: { code?: string; number?: string },
	currentPhone?: IPhone | null
): IPhone => ({
	code: value.code ?? currentPhone?.code ?? "",
	country: currentPhone?.country ?? "CO",
	number: value.number ?? currentPhone?.number ?? "",
	type: currentPhone?.type ?? CLIENT_PHONE_TYPE_MAIN,
	...(currentPhone?.channels ? { channels: currentPhone.channels } : {}),
});

/**
 * Channel selector: misma estructura visual que settings/contact (iconos + etiquetas).
 */
const ChannelSelector: FC<{
	value: ("phone" | "whatsapp")[];
	onChange: (value: ("phone" | "whatsapp")[]) => void;
	error?: boolean;
}> = ({ value, onChange, error }) => {
	const { t } = useTranslate();
	return (
		<div className="pt-2">
			<p className="text-tiny text-default-500 pb-2">
				{t("phones_card_available_channels", "Canales de contacto disponibles")}
			</p>
			<CheckboxGroup
				value={value}
				onValueChange={(newValue) =>
					onChange(newValue as ("phone" | "whatsapp")[])
				}
				orientation="horizontal"
				classNames={{ wrapper: "gap-4" }}
			>
				<Checkbox
					value="phone"
					classNames={{ wrapper: error ? "border-danger" : "" }}
				>
					<div className="flex items-center gap-2">
						<IconComponent
							icon="solar:phone-calling-linear"
							size="sm"
							className="text-primary"
						/>
						<span className="text-sm">
							{t("contact_method_phone", "Teléfono")}
						</span>
					</div>
				</Checkbox>
				<Checkbox
					value="whatsapp"
					classNames={{ wrapper: error ? "border-danger" : "" }}
				>
					<div className="flex items-center gap-2">
						<IconComponent
							icon="solar:chat-round-line-linear"
							size="sm"
							className="text-success"
						/>
						<span className="text-sm">
							{t("contact_method_whatsapp", "WhatsApp")}
						</span>
					</div>
				</Checkbox>
			</CheckboxGroup>
			{error && (
				<p className="text-tiny text-danger pt-1">
					{t("form_error_channel_required", "Selecciona al menos un canal")}
				</p>
			)}
		</div>
	);
};

/**
 * PhonesCard – Visual alineada con settings/contact PhoneForm.
 * Solo dos teléfonos: principal (obligatorio) y otro (opcional, se habilita con el switch "Habilitado").
 */
export const PhonesCard: FC<PhonesCardProps> = ({ client, onSave }) => {
	const { t } = useTranslate();
	const [isSaving, setIsSaving] = useState(false);

	const buildInitialPhones = useCallback((): IPhone[] => {
		const raw = client.phones ?? [];
		if (raw.length === 0) return [defaultPhone(CLIENT_PHONE_TYPE_MAIN)];
		const normalized = raw.slice(0, MAX_PHONES).map((p, index) => ({
			...p,
			type: normalizeClientPhoneType(p.type, index),
			channels:
				p.channels?.length
					? p.channels
					: (["phone", "whatsapp"] as ("phone" | "whatsapp")[]),
		}));
		return normalized;
	}, [client.phones]);

	const initialPhones = buildInitialPhones();

	const form = useForm<PhonesCardFormData>({
		mode: "onChange",
		defaultValues: {
			phones: initialPhones,
			channelPhone: initialPhones[0]?.channels?.includes("phone") ?? true,
			channelWhatsapp: initialPhones[0]?.channels?.includes("whatsapp") ?? true,
		},
	});

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors, isValid, isDirty },
	} = form;

	const { fields, append, replace } = useFieldArray({
		control,
		name: "phones",
	});

	const channelPhone = watch("channelPhone");
	const channelWhatsapp = watch("channelWhatsapp");
	const phones = watch("phones");

	const isOtherEnabled = fields.length >= 2;

	const toggleOtherPhone = useCallback(() => {
		if (isOtherEnabled) {
			replace(phones.slice(0, 1));
		} else {
			append(defaultPhone(CLIENT_PHONE_TYPE_OTHER));
		}
	}, [isOtherEnabled, phones, replace, append]);

	useEffect(() => {
		const next = buildInitialPhones();
		reset({
			phones: next,
			channelPhone: next[0]?.channels?.includes("phone") ?? true,
			channelWhatsapp: next[0]?.channels?.includes("whatsapp") ?? true,
		});
	}, [client.phones, buildInitialPhones, reset]);

	const buildPhonesWithChannels = (phonesList: IPhone[]): IPhone[] => {
		const main = phonesList[0];
		if (!main) return phonesList;
		const mainChannels: ("phone" | "whatsapp")[] = [];
		if (channelPhone) mainChannels.push("phone");
		if (channelWhatsapp) mainChannels.push("whatsapp");
		const result: IPhone[] = [
			{
				...main,
				type: CLIENT_PHONE_TYPE_MAIN,
				channels: mainChannels.length ? mainChannels : ["phone"],
			},
		];
		const other = phonesList[1];
		if (other?.number?.trim()) {
			result.push({
				...other,
				type: CLIENT_PHONE_TYPE_OTHER,
				channels:
					other.channels?.length ?
						other.channels
					:	(["phone"] as ("phone" | "whatsapp")[]),
			});
		}
		return result;
	};

	const onSubmit = handleSubmit(async (data) => {
		setIsSaving(true);
		try {
			const phonesToSave = buildPhonesWithChannels(data.phones);
			const payload: EditContactFormData = {
				...clientToEditContactFormData(client),
				phones: phonesToSave,
			};
			await Promise.resolve(onSave(payload));
		} finally {
			setIsSaving(false);
		}
	});

	return (
		<Card className="p-5 w-full gap-4" radius="sm">
			<div>
				<h2 className="font-medium text-lg text-foreground">
					{t("phones_card_title", "Teléfonos")}
				</h2>
				<p className="text-default-500 text-sm">
					{t(
						"phones_card_subtitle",
						"Gestiona los números de teléfono del cliente por tipo de contacto."
					)}
				</p>
			</div>

			<form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
				{/* Teléfono principal – misma estructura que settings */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<IconComponent
							icon="solar:phone-calling-bold"
							size="md"
							className="text-primary"
						/>
						<h3 className="font-medium text-base text-foreground">
							{t("phones_card_main_phone", "Teléfono principal")}
							<span className="text-danger ml-1">*</span>
						</h3>
					</div>
					<div className="space-y-2 pl-8">
						<Controller
							name="phones.0"
							control={control}
							rules={{
								required: t("field_required") as string,
								validate: (value) =>
									value?.number?.trim()
										? true
										: (t("form_error_required_field", "Este campo es requerido") as string),
							}}
							render={({ field }) => (
								<div>
									<Phone
										id="client-main-phone"
										label={t("phone", "Teléfono")}
										value={toPhoneValue(field.value)}
										onChange={(v) =>
											field.onChange(toDomainPhone(v, field.value))
										}
										required
										error={!!errors.phones?.[0]}
										errorText={
											(errors.phones?.[0] as { message?: string } | undefined)?.message
										}
										translations={{
											placeholder: t(
												"placeholder_enter_phone",
												"Ingresa el teléfono"
											),
											searchPlaceholder: t(
												"placeholder_search_phone",
												"Buscar país"
											),
											noCountriesFound: t(
												"no_countries_found",
												"No se encontraron países"
											),
										}}
									/>
									{!errors.phones?.[0] && (
										<p className="text-tiny text-default-500 pt-1">
											{t(
												"phones_card_main_phone_description",
												"Este número se usará para contactar al cliente por llamada y WhatsApp."
											)}
										</p>
									)}
								</div>
							)}
						/>
						<ChannelSelector
							value={[
								...(channelPhone ? (["phone"] as const) : []),
								...(channelWhatsapp ? (["whatsapp"] as const) : []),
							]}
							onChange={(channels) => {
								setValue("channelPhone", channels.includes("phone"), {
									shouldDirty: true,
								});
								setValue("channelWhatsapp", channels.includes("whatsapp"), {
									shouldDirty: true,
								});
							}}
						/>
					</div>
				</div>

				<Divider />

				{/* Otro teléfono – opcional, se habilita con el switch (visual como en settings) */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<IconComponent
								icon="solar:phone-linear"
								size="md"
								className="text-default-500"
							/>
							<h3 className="font-medium text-base text-foreground">
								{t("phones_card_other_phone", "Otro")}
							</h3>
						</div>
						<Switch
							size="sm"
							isSelected={isOtherEnabled}
							onValueChange={toggleOtherPhone}
						>
							<span className="text-sm text-default-500">
								{isOtherEnabled
									? t("enabled", "Habilitado")
									: t("disabled", "Deshabilitado")}
							</span>
						</Switch>
					</div>

					{isOtherEnabled && (
						<div className="space-y-2 pl-8">
							<Controller
								name="phones.1"
								control={control}
								render={({ field }) => (
									<div>
										<Phone
											id="client-other-phone"
											label={t("phone", "Teléfono")}
											value={toPhoneValue(field.value)}
											onChange={(v) =>
												field.onChange(toDomainPhone(v, field.value))
											}
											translations={{
												placeholder: t(
													"placeholder_enter_phone",
													"Ingresa tu teléfono"
												),
												searchPlaceholder: t(
													"placeholder_search_phone",
													"Buscar país"
												),
												noCountriesFound: t(
													"no_countries_found",
													"No se encontraron países"
												),
											}}
										/>
										<p className="text-tiny text-default-500 pt-1">
											{t(
												"phones_card_other_phone_caption",
												"Número de contacto adicional."
											)}
										</p>
									</div>
								)}
							/>
							<Controller
								name="phones.1"
								control={control}
								render={({ field }) => (
									<ChannelSelector
										value={
											field.value?.channels?.length
												? field.value.channels
												: (["phone", "whatsapp"] as ("phone" | "whatsapp")[])
										}
										onChange={(channels) =>
											field.onChange({
												...field.value,
												channels,
											})
										}
									/>
								)}
							/>
						</div>
					)}
				</div>

				<div className="flex flex-row justify-end">
					<Button
						type="submit"
						color="primary"
						size="sm"
						onPress={() => onSubmit()}
						isDisabled={!isValid || isSaving || !isDirty}
						isLoading={isSaving}
					>
						{t("button_save", "Guardar")}
					</Button>
				</div>
			</form>
		</Card>
	);
};
