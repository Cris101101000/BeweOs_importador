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
import type React from "react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import type { IPhoneContact } from "../../../bussinesConfig/domain/interfaces/business-information.interface";
import { usePhoneForm } from "../hooks/use-phone-form.hook";

// Component to select channels with checkboxes
const ChannelSelector: React.FC<{
	value: ("phone" | "whatsapp")[];
	onChange: (value: ("phone" | "whatsapp")[]) => void;
	onBlur?: () => void;
	error?: boolean;
	t: (key: string) => string;
}> = ({ value, onChange, onBlur, error, t }) => {
	return (
		<div className="pt-2">
			<p className="text-tiny text-default-500 pb-2">
				{t("settings_contact_phone_channels_label")}
			</p>
			<CheckboxGroup
				value={value}
				onValueChange={(newValue) =>
					onChange(newValue as ("phone" | "whatsapp")[])
				}
				onBlur={onBlur}
				orientation="horizontal"
				classNames={{
					wrapper: "gap-4",
				}}
			>
				<Checkbox
					value="phone"
					classNames={{
						wrapper: error ? "border-danger" : "",
					}}
				>
					<div className="flex items-center gap-2">
						<IconComponent
							icon="solar:phone-calling-linear"
							size="sm"
							className="text-primary"
						/>
						<span className="text-sm">
							{t("settings_contact_phone_channel_phone")}
						</span>
					</div>
				</Checkbox>
				<Checkbox
					value="whatsapp"
					classNames={{
						wrapper: error ? "border-danger" : "",
					}}
				>
					<div className="flex items-center gap-2">
						<IconComponent
							icon="solar:chat-round-line-linear"
							size="sm"
							className="text-success"
						/>
						<span className="text-sm">
							{t("settings_contact_phone_channel_whatsapp")}
						</span>
					</div>
				</Checkbox>
			</CheckboxGroup>
			{error && (
				<p className="text-tiny text-danger pt-1">
					{t("form_error_channel_required")}
				</p>
			)}
		</div>
	);
};

// Component for optional phone field with enable/disable
const OptionalPhoneField: React.FC<{
	name: string;
	label: string;
	caption: string;
	icon: string;
	iconColor: string;
	control: any;
	errors: any;
	t: (key: string) => string;
	watch: any;
	setValue: any;
}> = ({
	name,
	label,
	caption,
	icon,
	iconColor,
	control,
	errors,
	t,
	watch,
	setValue,
}) => {
	const phoneValue = watch(name);

	// Determinar si el teléfono está habilitado basándose en si existe y tiene datos válidos
	const hasValidPhone = phoneValue?.number && phoneValue.number.length > 0;
	const [isEnabled, setIsEnabled] = useState(hasValidPhone);

	// Sincronizar el estado del switch cuando cambian los datos del backend
	useEffect(() => {
		const hasPhone = phoneValue?.number && phoneValue.number.length > 0;
		setIsEnabled(hasPhone);
	}, [phoneValue?.number]);

	const handleToggle = (value: boolean) => {
		setIsEnabled(value);
		if (!value) {
			// Deshabilitar: establecer null para que NO se envíe al backend
			setValue(name, null, { shouldDirty: true });
		} else {
			// Habilitar: inicializar con valores por defecto
			setValue(
				name,
				{
					code: "+57",
					country: "CO",
					number: "",
					channels: ["phone", "whatsapp"],
				},
				{ shouldDirty: true }
			);
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<IconComponent icon={icon} size="md" className={iconColor} />
					<h3 className="font-medium text-base">{label}</h3>
				</div>
				<Switch size="sm" isSelected={isEnabled} onValueChange={handleToggle}>
					<span className="text-sm text-default-500">
						{isEnabled ? t("enabled") : t("disabled")}
					</span>
				</Switch>
			</div>

			{isEnabled && (
				<div className="space-y-2 pl-8">
					<Controller
						name={name}
						control={control}
						render={({ field: { value, onChange, onBlur } }) => (
							<div>
								<Phone
									id={`phone-${name}`}
									label=""
									translations={{
										placeholder: t("placeholder_enter_phone"),
										searchPlaceholder: t("placeholder_search_phone"),
										noCountriesFound: t("no_countries_found"),
									}}
									value={value || { code: "+57", country: "CO", number: "" }}
									onChange={(phoneValue) => {
										onChange({ ...value, ...phoneValue });
									}}
									onBlur={onBlur}
									error={!!errors[name]?.number}
									errorText={t(errors[name]?.number?.message || "")}
								/>
								{!errors[name]?.number && (
									<p className="text-tiny text-default-500 pt-1">{caption}</p>
								)}
							</div>
						)}
					/>
					<Controller
						name={`${name}.channels`}
						control={control}
						render={({ field }) => (
							<ChannelSelector
								value={field.value || ["phone", "whatsapp"]}
								onChange={field.onChange}
								onBlur={field.onBlur}
								error={!!errors[name]?.channels}
								t={t}
							/>
						)}
					/>
				</div>
			)}
		</div>
	);
};

export const PhoneForm: React.FC<{
	phones: IPhoneContact[];
	onDataUpdated?: () => void;
}> = ({ phones, onDataUpdated }) => {
	const {
		control,
		handleSubmit,
		errors,
		isValid,
		isSubmitting,
		t,
		isDirty,
		watch,
		setValue,
	} = usePhoneForm({
		phones,
		onDataUpdated,
	});

	return (
		<Card className="p-5 w-full gap-4">
			<div>
				<h2 className="font-medium text-lg">
					{t("settings_contact_phone_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_contact_phone_description")}
				</p>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
				{/* Main Phone - ContactType.Main - REQUIRED */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<IconComponent
							icon="solar:phone-calling-bold"
							size="md"
							className="text-primary"
						/>
						<h3 className="font-medium text-base">
							{t("settings_contact_phone_main")}
							<span className="text-danger ml-1">*</span>
						</h3>
					</div>
					<div className="space-y-2 pl-8">
						<Controller
							name="mainPhone"
							control={control}
							render={({ field: { value, onChange, onBlur } }) => (
								<div>
									<Phone
										id="main-phone"
										label=""
										translations={{
											placeholder: t("placeholder_enter_phone"),
											searchPlaceholder: t("placeholder_search_phone"),
											noCountriesFound: t("no_countries_found"),
										}}
										value={value}
										onChange={(phoneValue) => {
											onChange({ ...value, ...phoneValue });
										}}
										onBlur={onBlur}
										error={!!errors.mainPhone?.number}
										errorText={t(errors.mainPhone?.number?.message || "")}
										required
									/>
									{!errors.mainPhone?.number && (
										<p className="text-tiny text-default-500 pt-1">
											{t("settings_contact_phone_main_caption")}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							name="mainPhone.channels"
							control={control}
							render={({ field }) => (
								<ChannelSelector
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									error={!!errors.mainPhone?.channels}
									t={t}
								/>
							)}
						/>
					</div>
				</div>

				<Divider />

				{/* Optional Phones */}
				<div className="space-y-4">
					<p className="text-sm text-default-500">
						{t("settings_contact_phone_optional_section")}
					</p>

					{/* Support Phone - ContactType.Support */}
					<OptionalPhoneField
						name="supportPhone"
						label={t("settings_contact_phone_support")}
						caption={t("settings_contact_phone_support_caption")}
						icon="solar:headphones-round-sound-linear"
						iconColor="text-success"
						control={control}
						errors={errors}
						t={t}
						watch={watch}
						setValue={setValue}
					/>

					{/* Sales Phone - ContactType.Sales */}
					<OptionalPhoneField
						name="salesPhone"
						label={t("settings_contact_phone_sales")}
						caption={t("settings_contact_phone_sales_caption")}
						icon="solar:dollar-minimalistic-linear"
						iconColor="text-warning"
						control={control}
						errors={errors}
						t={t}
						watch={watch}
						setValue={setValue}
					/>

					{/* Technical Phone - ContactType.Technical */}
					<OptionalPhoneField
						name="technicalPhone"
						label={t("settings_contact_phone_technical")}
						caption={t("settings_contact_phone_technical_caption")}
						icon="solar:settings-linear"
						iconColor="text-secondary"
						control={control}
						errors={errors}
						t={t}
						watch={watch}
						setValue={setValue}
					/>

					{/* Other Phone - ContactType.Other */}
					<OptionalPhoneField
						name="otherPhone"
						label={t("settings_contact_phone_other")}
						caption={t("settings_contact_phone_other_caption")}
						icon="solar:phone-linear"
						iconColor="text-default-500"
						control={control}
						errors={errors}
						t={t}
						watch={watch}
						setValue={setValue}
					/>
				</div>

				<Button
					type="submit"
					className="w-36"
					isDisabled={!isValid || isSubmitting || !isDirty}
					isLoading={isSubmitting}
				>
					{isSubmitting ? t("button_saving") : t("button_save")}
				</Button>
			</form>
		</Card>
	);
};
