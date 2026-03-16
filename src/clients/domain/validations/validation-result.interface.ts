import type { ValidationErrorKeys } from "./validation-error-keys.enum";

export interface ValidationResult {
	isValid: boolean;
	errorKey?: ValidationErrorKeys;
	errorParams?: Record<string, string | number>;
}
