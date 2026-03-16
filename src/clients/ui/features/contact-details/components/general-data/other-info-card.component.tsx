import {
	Button,
	Card,
	DatePicker,
	Input,
	Select,
	SelectItem,
} from "@beweco/aurora-ui";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { EditContactFormData } from "../../types/edit-contact-form-data";
import { GenderSelect } from "@shared/ui/components";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

export interface OtherInfoCardProps {
	control: Control<EditContactFormData>;
	errors: FieldErrors<EditContactFormData>;
	onSubmit: () => void;
	isValid: boolean;
	isDirty: boolean;
	isSaving: boolean;
	statusOptions: EnumClientStatus[];
}

/**
 * Card "Otra información": formulario de correo, estado, fecha de nacimiento y género.
 */
export const OtherInfoCard: FC<OtherInfoCardProps> = ({
	control,
	errors,
	onSubmit,
	isValid,
	isDirty,
	isSaving,
	statusOptions,
}) => {
	const { t } = useTranslate();

	return (
		<Card radius="sm">
			<div>
				<h2 className="font-medium text-lg text-foreground">
					{t("general_data_card_title", "Otra información")}
				</h2>
				<p className="text-default-500 text-sm mt-0.5">
					{t(
						"general_data_card_subtitle",
						"Correo, estado, fecha de nacimiento y género."
					)}
				</p>
			</div>
			<form className="w-full flex flex-col gap-4" onSubmit={onSubmit} noValidate>
				<div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
					<Controller
						name="email"
						control={control}
						rules={{
							required: t("field_required") as string,
							validate: (value) =>
								/.+@.+\..+/.test(value) ||
								(t("invalid_email_format", "Correo inválido") as string),
						}}
						render={({ field }) => (
							<Input
								{...field}
								type="email"
								label={t("email", "Correo electrónico")}
								isRequired
								isInvalid={!!errors.email}
								errorMessage={errors.email?.message}
							/>
						)}
					/>

					<Controller
						name="status"
						control={control}
						rules={{ required: t("field_required") as string }}
						render={({ field }) => (
							<Select
								label={t("status", "Estado")}
								placeholder={t(
									"placeholder_select_status",
									"Selecciona un estado"
								)}
								selectedKeys={field.value ? [field.value] : []}
								onSelectionChange={(keys) =>
									field.onChange(Array.from(keys)[0])
								}
								isInvalid={!!errors.status}
								isRequired
							>
								{statusOptions.map((status) => (
									<SelectItem
										key={status}
										textValue={t(STATUS_CLIENT[status].translationKey)}
									>
										{t(STATUS_CLIENT[status].translationKey)}
									</SelectItem>
								))}
							</Select>
						)}
					/>

					<Controller
						name="birthdate"
						control={control}
						rules={{
							required: {
								value: true,
								message: t(
									"field_birthdate_required",
									"La fecha de cumpleaños es requerida"
								) as string,
							},
						}}
						render={({ field }) => (
							<DatePicker
								label={t("field_birthdate", "Fecha de cumpleaños")}
								value={field.value || null}
								onChange={(dateValue) => field.onChange(dateValue)}
								isInvalid={!!errors.birthdate}
								errorMessage={errors.birthdate?.message as string}
								size="md"
								isRequired
							/>
						)}
					/>

					<Controller
						name="gender"
						control={control}
						rules={{
							required: {
								value: true,
								message: t(
									"field_gender_required",
									"El género es requerido"
								) as string,
							},
						}}
						render={({ field }) => (
							<GenderSelect
								value={field.value}
								onSelectionChange={field.onChange}
								isInvalid={!!errors.gender}
								errorMessage={errors.gender?.message as string}
								isRequired
							/>
						)}
					/>
				</div>
				<div className="flex flex-row justify-end">
					<Button
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
