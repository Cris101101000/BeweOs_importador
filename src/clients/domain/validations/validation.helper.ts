import type { ValidationResult } from "./validation-result.interface";

/**
 * Helper para obtener el mensaje de error traducido desde un ValidationResult
 * @param validationResult - Resultado de la validación
 * @param t - Función de traducción de i18n
 * @returns Mensaje de error traducido o undefined si la validación es exitosa
 */
export const getValidationErrorMessage = (
	validationResult: ValidationResult,
	t: (key: string, params?: Record<string, string | number>) => string
): string | undefined => {
	if (validationResult.isValid || !validationResult.errorKey) {
		return undefined;
	}

	return t(validationResult.errorKey, validationResult.errorParams);
};

/**
 * Helper para validar y obtener directamente el mensaje de error
 * @param validator - Función de validación
 * @param value - Valor a validar
 * @param t - Función de traducción de i18n
 * @returns Mensaje de error traducido o undefined si la validación es exitosa
 */
export const validateAndGetErrorMessage = <T>(
	validator: (value: T) => ValidationResult,
	value: T,
	t: (key: string, params?: Record<string, string | number>) => string
): string | undefined => {
	const result = validator(value);
	return getValidationErrorMessage(result, t);
};
