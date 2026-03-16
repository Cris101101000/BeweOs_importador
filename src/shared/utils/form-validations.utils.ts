import { z } from "zod";

/**
 * Utility functions for form validations
 */

/**
 * Creates a URL validation schema that allows empty fields but validates non-empty values as proper URLs
 *
 * @param errorMessage - Custom error message for invalid URLs
 * @returns Zod schema for URL validation
 *
 * @example
 * ```typescript
 * const urlSchema = createOptionalUrlValidation("Invalid URL format");
 * const result = urlSchema.safeParse("https://example.com");
 * ```
 */
export const createOptionalUrlValidation = (errorMessage = "URL inválida") =>
	z.string().refine(
		(val) => {
			// Empty values are valid (optional fields)
			if (!val || val.trim() === "") return true;
			// Non-empty values must be valid URLs
			try {
				new URL(val);
				return true;
			} catch {
				return false;
			}
		},
		{
			message: errorMessage,
		}
	);

/**
 * Validates if a string is a valid URL
 *
 * @param url - The URL string to validate
 * @returns True if the URL is valid, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = isValidUrl("https://example.com"); // true
 * const isInvalid = isValidUrl("not-a-url"); // false
 * ```
 */
export const isValidUrl = (url: string): boolean => {
	if (!url || url.trim() === "") return false;
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

/**
 * Validates if a string is a valid email
 *
 * @param email - The email string to validate
 * @returns True if the email is valid, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = isValidEmail("user@example.com"); // true
 * const isInvalid = isValidEmail("not-an-email"); // false
 * ```
 */
export const isValidEmail = (email: string): boolean => {
	if (!email || email.trim() === "") return false;
	return z.string().email().safeParse(email).success;
};

/**
 * Creates an email validation schema that allows empty fields but validates non-empty values as proper emails
 *
 * @param errorMessage - Custom error message for invalid emails
 * @returns Zod schema for email validation
 *
 * @example
 * ```typescript
 * const emailSchema = createOptionalEmailValidation("Invalid email format");
 * const result = emailSchema.safeParse("user@example.com");
 * ```
 */
export const createOptionalEmailValidation = (
	errorMessage = "Email inválido"
) =>
	z.string().refine(
		(val) => {
			// Empty values are valid (optional fields)
			if (!val || val.trim() === "") return true;
			// Non-empty values must be valid emails
			return z.string().email().safeParse(val).success;
		},
		{
			message: errorMessage,
		}
	);
