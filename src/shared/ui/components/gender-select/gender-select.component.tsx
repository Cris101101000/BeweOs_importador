import { Select, SelectItem, type Selection } from "@beweco/aurora-ui";
import { EnumGender } from "@shared/domain/enums";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useMemo } from "react";

export interface GenderSelectProps {
	value?: EnumGender | null;
	onSelectionChange: (gender: EnumGender | null) => void;
	isRequired?: boolean;
	isInvalid?: boolean;
	errorMessage?: string;
	label?: string;
	placeholder?: string;
	className?: string;
	isDisabled?: boolean;
}

/**
 * GenderSelect Component
 *
 * A select component for gender options using the EnumGender domain enum.
 * Provides localized options for Female, Male, Other, and Not Specified.
 *
 * Features:
 * - Internationalization support with Tolgee
 * - Integration with react-hook-form through Controller
 * - Aurora UI design system compliance
 * - Proper TypeScript typing with EnumGender
 * - Accessible form validation support
 *
 * @param value - Currently selected gender value
 * @param onSelectionChange - Callback when selection changes
 * @param isRequired - Whether the field is required
 * @param isInvalid - Whether the field has validation errors
 * @param errorMessage - Error message to display
 * @param label - Label for the select field
 * @param placeholder - Placeholder text when no option is selected
 * @param className - Additional CSS classes
 * @param isDisabled - Whether the select is disabled
 */
export const GenderSelect: FC<GenderSelectProps> = ({
	value,
	onSelectionChange,
	isRequired = false,
	isInvalid = false,
	errorMessage,
	label,
	placeholder,
	className,
	isDisabled = false,
}) => {
	const { t } = useTranslate();

	/**
	 * Memoized list of gender options with their translations.
	 * This prevents the array from being recreated on every render.
	 */
	const genderOptions = useMemo(
		() => [
			{
				value: EnumGender.Female,
				label: t("gender_female", "Mujer"),
			},
			{
				value: EnumGender.Male,
				label: t("gender_male", "Hombre"),
			},
			{
				value: EnumGender.Other,
				label: t("gender_other", "Otro"),
			},
			{
				value: EnumGender.Unspecified,
				label: t("gender_not_specified", "Sin especificar"),
			},
		],
		[t]
	);

	const handleSelectionChange = (keys: Selection) => {
		if (keys === "all") return;

		const selectedKey = Array.from(keys)[0];
		const selectedGender = selectedKey ? (selectedKey as EnumGender) : null;
		onSelectionChange(selectedGender);
	};

	return (
		<Select
			label={label || t("field_gender", "Género")}
			placeholder={
				placeholder || t("placeholder_select_gender", "Selecciona un género")
			}
			isRequired={isRequired}
			isInvalid={isInvalid}
			errorMessage={errorMessage}
			selectedKeys={value ? [value] : []}
			onSelectionChange={handleSelectionChange}
			className={className}
			isDisabled={isDisabled}
		>
			{genderOptions.map((option) => (
				<SelectItem key={option.value}>{option.label}</SelectItem>
			))}
		</Select>
	);
};

GenderSelect.displayName = "GenderSelect";
