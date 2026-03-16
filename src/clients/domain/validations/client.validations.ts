import type { IPhone } from "@shared/domain/interfaces/phone.interface";
import { ValidationErrorKeys } from "./validation-error-keys.enum";
import type { ValidationResult } from "./validation-result.interface";

export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_PHONE_LENGTH = 15;
export const MAX_PHONES_COUNT = 3;

/**
 * Valida el nombre del cliente
 * @param name - Nombre del cliente a validar
 * @returns ValidationResult con el resultado de la validación
 */
export const validateName = (name: string): ValidationResult => {
	if (!name?.trim()) {
		return { isValid: false, errorKey: ValidationErrorKeys.NameRequired };
	}

	if (name.trim().length < MIN_NAME_LENGTH) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.NameMinLength,
			errorParams: { min: MIN_NAME_LENGTH },
		};
	}

	if (name.length > MAX_NAME_LENGTH) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.NameMaxLength,
			errorParams: { max: MAX_NAME_LENGTH },
		};
	}

	// Validar que contenga solo letras, espacios y algunos caracteres especiales
	const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
	if (!nameRegex.test(name.trim())) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.NameInvalidFormat,
		};
	}

	return { isValid: true };
};

/**
 * Valida el email del cliente
 * @param email - Email del cliente a validar
 * @returns ValidationResult con el resultado de la validación
 */
export const validateEmail = (email: string): ValidationResult => {
	if (!email?.trim()) {
		return { isValid: false, errorKey: ValidationErrorKeys.EmailRequired };
	}

	// Regex más completa para validación de email
	const emailRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

	if (!emailRegex.test(email.trim())) {
		return { isValid: false, errorKey: ValidationErrorKeys.EmailInvalidFormat };
	}

	if (email.length > MAX_EMAIL_LENGTH) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.EmailMaxLength,
			errorParams: { max: MAX_EMAIL_LENGTH },
		};
	}

	return { isValid: true };
};

/**
 * Valida un teléfono individual
 * @param phone - Teléfono a validar
 * @returns ValidationResult con el resultado de la validación
 */
export const validatePhone = (phone: IPhone): ValidationResult => {
	if (!phone) {
		return { isValid: false, errorKey: ValidationErrorKeys.PhoneRequired };
	}

	// Validar código de país
	if (!phone.code?.trim()) {
		return { isValid: false, errorKey: ValidationErrorKeys.PhoneCodeRequired };
	}

	const codeRegex = /^\+\d{1,4}$/;
	if (!codeRegex.test(phone.code)) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.PhoneCodeInvalidFormat,
		};
	}

	// Validar país
	if (!phone.country?.trim()) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.PhoneCountryRequired,
		};
	}

	const countryRegex = /^[A-Z]{2}$/;
	if (!countryRegex.test(phone.country)) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.PhoneCountryInvalidFormat,
		};
	}

	// Validar número
	if (!phone.number?.trim()) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.PhoneNumberRequired,
		};
	}

	// Solo números, sin espacios ni caracteres especiales
	const numberRegex = /^\d{7,15}$/;
	if (!numberRegex.test(phone.number.replace(/\s/g, ""))) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.PhoneNumberInvalidFormat,
			errorParams: { min: 7, max: MAX_PHONE_LENGTH },
		};
	}

	return { isValid: true };
};

/**
 * Valida el array de teléfonos del cliente
 * @param phones - Array de teléfonos a validar
 * @returns ValidationResult con el resultado de la validación
 */
export const validatePhones = (phones: IPhone[]): ValidationResult => {
	if (!phones || phones.length === 0) {
		return { isValid: false, errorKey: ValidationErrorKeys.PhonesRequired };
	}

	if (phones.length > 3) {
		return {
			isValid: false,
			errorKey: ValidationErrorKeys.PhonesMaxCount,
			errorParams: { max: MAX_PHONES_COUNT },
		};
	}

	// Validar cada teléfono individualmente
	for (let i = 0; i < phones.length; i++) {
		const phoneValidation = validatePhone(phones[i]);
		if (!phoneValidation.isValid) {
			return {
				isValid: false,
				errorKey: phoneValidation.errorKey,
				errorParams: {
					...phoneValidation.errorParams,
					phoneIndex: i + 1,
				},
			};
		}
	}

	// Verificar que no haya teléfonos duplicados
	const phoneNumbers = phones.map((phone) => `${phone.code}${phone.number}`);
	const uniqueNumbers = new Set(phoneNumbers);
	if (phoneNumbers.length !== uniqueNumbers.size) {
		return { isValid: false, errorKey: ValidationErrorKeys.PhonesDuplicated };
	}

	return { isValid: true };
};

/**
 * Valida todos los campos requeridos para crear un cliente
 * @param clientData - Datos del cliente a validar
 * @returns ValidationResult con el resultado de la validación completa
 */
export const validateClientCreation = (clientData: {
	name: string;
	email: string;
	phones: IPhone[];
}): ValidationResult => {
	// Validar nombre
	const nameValidation = validateName(clientData.name);
	if (!nameValidation.isValid) {
		return nameValidation;
	}

	// Validar email
	const emailValidation = validateEmail(clientData.email);
	if (!emailValidation.isValid) {
		return emailValidation;
	}

	// Validar teléfonos
	const phonesValidation = validatePhones(clientData.phones);
	if (!phonesValidation.isValid) {
		return phonesValidation;
	}

	return { isValid: true };
};
