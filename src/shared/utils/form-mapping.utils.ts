/**
 * Utility functions for form data mapping and transformation
 */

/**
 * Cleans a string by trimming whitespace and converting empty strings to undefined
 *
 * @param value - The string value to clean
 * @returns The cleaned string or undefined if empty
 *
 * @example
 * ```typescript
 * const cleaned = cleanStringOrUndefined("  hello  "); // "hello"
 * const empty = cleanStringOrUndefined("   "); // undefined
 * const nullish = cleanStringOrUndefined(""); // undefined
 * ```
 */
export const cleanStringOrUndefined = (
	value: string | undefined | null
): string | undefined => {
	const trimmed = value?.trim();
	return trimmed && trimmed !== "" ? trimmed : undefined;
};

/**
 * Cleans an array of strings by removing empty values and trimming whitespace
 *
 * @param values - Array of string values to clean
 * @returns Array of cleaned strings with empty values removed
 *
 * @example
 * ```typescript
 * const cleaned = cleanStringArray(["  hello  ", "", "world", "   "]); // ["hello", "world"]
 * ```
 */
export const cleanStringArray = (
	values: (string | undefined | null)[]
): string[] => {
	return values
		.map(cleanStringOrUndefined)
		.filter((value): value is string => value !== undefined);
};

/**
 * Maps form URL fields to a clean object, removing empty values
 *
 * @param formData - Object containing form URL fields
 * @returns Object with cleaned URL values (undefined for empty fields)
 *
 * @example
 * ```typescript
 * const urls = mapFormUrlsToCleanObject({
 *   website: "  https://example.com  ",
 *   instagram: "",
 *   facebook: "https://facebook.com/page"
 * });
 * // Result: { website: "https://example.com", facebook: "https://facebook.com/page" }
 * ```
 */
export const mapFormUrlsToCleanObject = <
	T extends Record<string, string | undefined>,
>(
	formData: T
): { [K in keyof T]: string | undefined } => {
	const result = {} as { [K in keyof T]: string | undefined };

	for (const [key, value] of Object.entries(formData)) {
		result[key as keyof T] = cleanStringOrUndefined(value as string);
	}

	return result;
};

/**
 * Converts an object with potentially undefined values to only include defined values
 *
 * @param obj - Object with potentially undefined values
 * @returns Object with only defined values
 *
 * @example
 * ```typescript
 * const cleaned = removeUndefinedValues({
 *   name: "John",
 *   email: undefined,
 *   website: "https://example.com"
 * });
 * // Result: { name: "John", website: "https://example.com" }
 * ```
 */
export const removeUndefinedValues = <T extends Record<string, any>>(
	obj: T
): Partial<T> => {
	const result: Partial<T> = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null) {
			result[key as keyof T] = value;
		}
	}

	return result;
};

/**
 * Transforms form data with suffix-based keys to clean domain object
 * Useful for forms with fields like "instagramUrl", "facebookUrl" etc.
 *
 * @param formData - Form data object with suffixed keys
 * @param suffix - Suffix to remove from keys (default: "Url")
 * @returns Clean object with suffix removed from keys
 *
 * @example
 * ```typescript
 * const social = transformSuffixedFormData({
 *   instagramUrl: "https://instagram.com/user",
 *   facebookUrl: "",
 *   twitterUrl: "https://twitter.com/user"
 * });
 * // Result: { instagram: "https://instagram.com/user", twitter: "https://twitter.com/user" }
 * ```
 */
export const transformSuffixedFormData = <
	T extends Record<string, string | undefined>,
>(
	formData: T,
	suffix = "Url"
): Record<string, string | undefined> => {
	const result: Record<string, string | undefined> = {};

	for (const [key, value] of Object.entries(formData)) {
		const cleanKey = key.endsWith(suffix) ? key.slice(0, -suffix.length) : key;
		const cleanValue = cleanStringOrUndefined(value as string);

		if (cleanValue !== undefined) {
			result[cleanKey] = cleanValue;
		}
	}

	return result;
};
