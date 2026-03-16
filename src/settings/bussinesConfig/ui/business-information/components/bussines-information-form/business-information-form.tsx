import { Button, Input } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { Controller } from "react-hook-form";
import { useBusinessInformationForm } from "../../hooks/use-business-information-form.hook";
import type { BusinessInformationFormProps } from "./business-information-form.types";

/**
 * A form for editing basic business information.
 * It uses the `useBusinessInformationForm` hook to manage state and submission.
 * @param {BusinessInformationFormProps} props - The component props.
 * @returns {React.FC} The rendered form component.
 */
export const BusinessInformationForm: React.FC<
	BusinessInformationFormProps
> = ({ initialData, onDataUpdated }) => {
	const { t } = useTranslate();
	const { control, handleSubmit, errors, isSubmitting, isValid, isDirty } =
		useBusinessInformationForm({
			initialData: initialData || undefined,
			onDataUpdated,
		});

	return (
		<>
			<div>
				<h2 className="font-medium text-lg">
					{t("settings_business_information_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_business_information_description")}
				</p>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							label={t("settings_business_field_name_label")}
							placeholder={t("settings_business_field_name_placeholder")}
							errorMessage={errors.name?.message}
							isInvalid={!!errors.name}
							isRequired
						/>
					)}
				/>

				<Controller
					name="taxId"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							label={t("tax_id")}
							placeholder={t("settings_business_field_tax_id_placeholder")}
							errorMessage={errors.taxId?.message}
							isInvalid={!!errors.taxId}
							isRequired
						/>
					)}
				/>

				<Button
					type="submit"
					className="w-36"
					isDisabled={!isValid || isSubmitting || !isDirty}
					isLoading={isSubmitting}
				>
					{isSubmitting ? t("button_saving") : t("button_save")}
				</Button>
			</form>
		</>
	);
};

export default BusinessInformationForm;
