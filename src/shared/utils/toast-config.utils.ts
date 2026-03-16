import type { AlertProps } from "@beweco/aurora-ui";
import {
	ERROR_TYPE_TO_COLOR_MAP,
	ERROR_TYPE_TO_TITLE_MAP,
	type EnumErrorType,
} from "../domain/enums/enum-error-type.enum";

/**
 * Translation function type for toast messages
 */
export type TranslateFunction = (key: string, fallback?: string) => string;

/**
 * Toast configuration interface
 */
export interface ToastConfig {
	color: AlertProps["color"];
	title: string;
	description?: string;
}

/**
 * Configures a toast notification based on the error type with translation support
 *
 * @param errorType - The type of error that occurred
 * @param t - Translation function from useTranslate hook
 * @param customTitle - Optional custom title, if not provided uses default translation key
 * @param customDescription - Optional custom description
 * @returns Toast configuration object with appropriate color and translated messages
 *
 * @example
 * ```typescript
 * const { t } = useTranslate();
 * const toastConfig = configureErrorToastWithTranslation(
 *   EnumErrorType.Validation,
 *   t,
 *   "custom_validation_error",
 *   "custom_validation_description"
 * );
 *
 * showToast(toastConfig);
 * ```
 */
export const configureErrorToastWithTranslation = (
	errorType: EnumErrorType,
	t: TranslateFunction,
	customTitle?: string,
	customDescription?: string
): ToastConfig => {
	const titleKey = customTitle || ERROR_TYPE_TO_TITLE_MAP[errorType];
	const title = t(titleKey, titleKey);
	const description = customDescription
		? t(customDescription, customDescription)
		: t("try_again", "Intenta nuevamente");

	return {
		color: ERROR_TYPE_TO_COLOR_MAP[errorType],
		title,
		description,
	};
};

/**
 * Configures a success toast notification
 *
 * @param title - The main message to display in the toast
 * @param description - Optional additional description
 * @returns Toast configuration object with success color
 *
 * @example
 * ```typescript
 * const toastConfig = configureSuccessToast("Operación exitosa");
 * showToast(toastConfig);
 * ```
 */
export const configureSuccessToast = (
	title: string,
	description?: string
): ToastConfig => {
	return {
		color: "success",
		title,
		description,
	};
};

/**
 * Configures a warning toast notification
 *
 * @param title - The main message to display in the toast
 * @param description - Optional additional description
 * @returns Toast configuration object with warning color
 *
 * @example
 * ```typescript
 * const toastConfig = configureWarningToast("Advertencia");
 * showToast(toastConfig);
 * ```
 */
export const configureWarningToast = (
	title: string,
	description?: string
): ToastConfig => {
	return {
		color: "warning",
		title,
		description,
	};
};

/**
 * Gets the toast color for a specific error type
 *
 * @param errorType - The type of error
 * @returns The corresponding toast color
 *
 * @example
 * ```typescript
 * const color = getErrorToastColor(EnumErrorType.Validation); // "danger"
 * ```
 */
export const getErrorToastColor = (
	errorType: EnumErrorType
): AlertProps["color"] => {
	return ERROR_TYPE_TO_COLOR_MAP[errorType];
};
