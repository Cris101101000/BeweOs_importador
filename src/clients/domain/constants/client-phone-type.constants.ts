/**
 * Allowed phone types for client phones.
 * Validated against API gateway; if not present or unknown, use only main (principal) and other (otro).
 */
export const CLIENT_PHONE_TYPES = ["main", "other"] as const;

export type ClientPhoneType = (typeof CLIENT_PHONE_TYPES)[number];

/** Default type for the primary phone */
export const CLIENT_PHONE_TYPE_MAIN: ClientPhoneType = "main";

/** Default type for additional phones */
export const CLIENT_PHONE_TYPE_OTHER: ClientPhoneType = "other";

/**
 * Normalizes a phone type from API to an allowed client phone type.
 * If the type is not in CLIENT_PHONE_TYPES, returns main for first phone or other for rest.
 */
export function normalizeClientPhoneType(
	value: string | undefined,
	index: number
): ClientPhoneType {
	if (value && CLIENT_PHONE_TYPES.includes(value as ClientPhoneType)) {
		return value as ClientPhoneType;
	}
	return index === 0 ? CLIENT_PHONE_TYPE_MAIN : CLIENT_PHONE_TYPE_OTHER;
}
