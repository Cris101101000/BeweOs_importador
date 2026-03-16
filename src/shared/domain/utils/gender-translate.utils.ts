import { EnumGender } from "../enums/enum-gender.enum";

/**
 * Get the translation for a gender value
 * @param gender - The gender enum value to translate
 * @param t - Translation function from useTranslate hook
 * @returns The translated gender string
 */
export const getGenderTranslate = (
	gender: EnumGender,
	t: (key: string, fallback?: string) => string
): string => {
	switch (gender) {
		case EnumGender.Female:
			return t("gender_female", "Mujer");
		case EnumGender.Male:
			return t("gender_male", "Hombre");
		case EnumGender.Other:
			return t("gender_other", "Otro");
		case EnumGender.Unspecified:
			return t("gender_not_specified", "Sin especificar");
		default:
			return t("gender_not_specified", "Sin especificar");
	}
};
