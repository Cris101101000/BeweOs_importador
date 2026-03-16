export {
	validateName,
	validateEmail,
	validatePhone,
	validatePhones,
	validateClientCreation,
	MIN_NAME_LENGTH,
	MAX_NAME_LENGTH,
	MAX_EMAIL_LENGTH,
	MAX_PHONE_LENGTH,
	MAX_PHONES_COUNT,
} from "./client.validations";
export type { ValidationResult } from "./validation-result.interface";
export { ValidationErrorKeys } from "./validation-error-keys.enum";
export {
	getValidationErrorMessage,
	validateAndGetErrorMessage,
} from "./validation.helper";
