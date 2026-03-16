import { Input, Phone } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import { DEFAULT_MESSAGES } from "../../../../constants/basic-info-form.constants.ts";
import { useWizardValidation } from "../../contexts/wizard-validation.context.tsx";
import type { BasicInfoStepProps } from "./basic-info-step.types.ts";
import { useBasicInfoForm } from "./hooks/use-basic-info-form.hook";

/**
 * First step of the client creation wizard
 * Collects basic client information with proper validation and error handling
 */
export const BasicInfoStep: FC<BasicInfoStepProps> = ({
	data,
	onUpdate,
	stepIndex,
}) => {
	const { t } = useTranslate();
	const { updateStepValidity } = useWizardValidation();

	const { control, trigger, errors, toPhoneValue, toDomainPhone } =
		useBasicInfoForm({
			data,
			onUpdate,
			stepIndex,
			updateStepValidity,
		});

	return (
		<div>
			<div className="flex flex-col gap-4">
				{/* First Name Field */}
				<Controller
					name="firstName"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							label={t("field_first_name", DEFAULT_MESSAGES.firstName)}
							placeholder={t(
								"placeholder_enter_first_name",
								DEFAULT_MESSAGES.placeholderFirstName
							)}
							isRequired
							isInvalid={!!errors.firstName}
							errorMessage={errors.firstName?.message}
							onBlur={() => {
								field.onBlur();
								trigger("firstName");
							}}
							className="w-full"
						/>
					)}
				/>

				{/* Last Name Field */}
				<Controller
					name="lastName"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							label={t("field_last_name", DEFAULT_MESSAGES.lastName)}
							placeholder={t(
								"placeholder_enter_last_name",
								DEFAULT_MESSAGES.placeholderLastName
							)}
							isRequired
							isInvalid={!!errors.lastName}
							errorMessage={errors.lastName?.message}
							onBlur={() => {
								field.onBlur();
								trigger("lastName");
							}}
							className="w-full"
						/>
					)}
				/>

				{/* Email Field */}
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							label={t("field_email", DEFAULT_MESSAGES.email)}
							placeholder={t(
								"placeholder_enter_email",
								DEFAULT_MESSAGES.placeholderEmail
							)}
							type="email"
							isRequired
							isInvalid={!!errors.email}
							errorMessage={errors.email?.message}
							onBlur={() => {
								field.onBlur();
								trigger("email");
							}}
							className="w-full"
						/>
					)}
				/>

				{/* Phone Field */}
				<Controller
					name="phone"
					control={control}
					render={({ field }) => (
						<Phone
							label={t("field_phone", DEFAULT_MESSAGES.phone)}
							value={toPhoneValue(field.value)}
							onChange={(phoneValue) => {
								field.onChange(toDomainPhone(phoneValue, field.value));
							}}
							onBlur={() => {
								field.onBlur();
								trigger("phone");
							}}
							required
							error={!!errors.phone}
							errorText={errors.phone?.number?.message || errors.phone?.message}
							translations={{
								placeholder: t(
									"placeholder_enter_phone",
									DEFAULT_MESSAGES.placeholderPhone
								),
								searchPlaceholder: t(
									"placeholder_search_phone",
									DEFAULT_MESSAGES.placeholderSearchPhone
								),
								noCountriesFound: t(
									"no_countries_found",
									DEFAULT_MESSAGES.noCountriesFound
								),
							}}
						/>
					)}
				/>
			</div>
		</div>
	);
};

BasicInfoStep.displayName = "BasicInfoStep";
