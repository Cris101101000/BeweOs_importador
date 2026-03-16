import { ApplicableEntity } from "../../domain/enums/applicable-entity.enum";

/**
 * Get all applicable entity values as an array
 * Useful for dynamic rendering of options
 * Returns all string values from the enum
 */
export const getApplicableEntityValues = (): ApplicableEntity[] => {
	// Object.values of an enum returns both keys and values
	// We need to filter to get only the string values (not the numeric keys)
	const allValues = Object.values(ApplicableEntity);
	return allValues.filter(
		(value): value is ApplicableEntity => typeof value === "string"
	);
};

/**
 * Dictionary that maps enum values (lowercase) to API values (uppercase)
 */
export const APPLICABLE_ENTITY_TO_API_MAP: Record<ApplicableEntity, string> =
	(() => {
		const map: Record<string, string> = {};

		// Iterate through enum keys to build the mapping dynamically
		Object.keys(ApplicableEntity).forEach((key) => {
			if (isNaN(Number(key))) {
				const enumValue =
					ApplicableEntity[key as keyof typeof ApplicableEntity];
				if (typeof enumValue === "string") {
					map[enumValue] = key; // key is already uppercase (e.g., 'CLIENT', 'COMMUNICATION')
				}
			}
		});

		return map as Record<ApplicableEntity, string>;
	})();

/**
 * Converts an applicable entity value (enum value) to its API format (uppercase key)
 * @param entity - The entity value from the enum (e.g., 'client', 'communication')
 * @returns The API format value (e.g., 'CLIENT', 'COMMUNICATION') or undefined if not found
 */
export const getApiValueFromEntity = (
	entity: ApplicableEntity | string
): string | undefined => {
	return APPLICABLE_ENTITY_TO_API_MAP[entity as ApplicableEntity];
};

/**
 * Converts an API entity type (uppercase) to the enum value (lowercase)
 * @param apiEntityType - The API format value (e.g., 'CLIENT', 'COMMUNICATION')
 * @returns The enum value (e.g., 'client', 'communication') or undefined if not found
 */
export const getEntityFromApiValue = (
	apiEntityType: string
): ApplicableEntity | undefined => {
	const enumValue =
		ApplicableEntity[apiEntityType as keyof typeof ApplicableEntity];
	return typeof enumValue === "string"
		? (enumValue as ApplicableEntity)
		: undefined;
};
