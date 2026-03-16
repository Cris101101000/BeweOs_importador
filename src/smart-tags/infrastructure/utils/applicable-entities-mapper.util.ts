import { ApplicableEntity } from "../../domain/enums/applicable-entity.enum";

/**
 * Maps an array of string entities (from API) to ApplicableEntity enum values
 * Handles both lowercase enum values and uppercase API keys
 *
 * @param entities - Array of entity strings from API (e.g., ['CLIENT', 'COMMUNICATION'] or ['client', 'communication'])
 * @returns Array of valid ApplicableEntity enum values
 *
 * @example
 * mapToApplicableEntities(['CLIENT', 'COMMUNICATION'])
 * // Returns: [ApplicableEntity.CLIENT, ApplicableEntity.COMMUNICATION]
 *
 * @example
 * mapToApplicableEntities(['client'])
 * // Returns: [ApplicableEntity.CLIENT]
 */
export const mapToApplicableEntities = (
	entities: string[]
): ApplicableEntity[] => {
	const validEntities = Object.values(ApplicableEntity);

	return entities
		.map((entity) => {
			const normalizedEntity = entity.toLowerCase() as ApplicableEntity;

			// Check if it's a valid enum value (lowercase)
			if (validEntities.includes(normalizedEntity)) {
				return normalizedEntity;
			}

			// Try to get the enum value from the uppercase key (e.g., 'CLIENT' -> 'client')
			const enumValue =
				ApplicableEntity[entity as keyof typeof ApplicableEntity];
			if (enumValue && validEntities.includes(enumValue)) {
				return enumValue;
			}

			return null;
		})
		.filter((entity): entity is ApplicableEntity => entity !== null);
};

/**
 * Checks if a tag applies to a specific entity
 *
 * @param applicableEntities - Array of ApplicableEntity from the tag
 * @param entity - The entity to check
 * @returns boolean indicating if the tag applies to the entity
 *
 * @example
 * appliesToEntity([ApplicableEntity.CLIENT, ApplicableEntity.COMMUNICATION], ApplicableEntity.CLIENT)
 * // Returns: true
 */
export const appliesToEntity = (
	applicableEntities: ApplicableEntity[],
	entity: ApplicableEntity
): boolean => {
	return applicableEntities.includes(entity);
};

/**
 * Converts ApplicableEntity enum values to API format (uppercase keys)
 *
 * @param entities - Array of ApplicableEntity enum values
 * @returns Array of uppercase API format strings
 *
 * @example
 * mapToApiFormat([ApplicableEntity.CLIENT, ApplicableEntity.COMMUNICATION])
 * // Returns: ['CLIENT', 'COMMUNICATION']
 */
export const mapToApiFormat = (entities: ApplicableEntity[]): string[] => {
	return entities.map((entity) => {
		// Find the key in the enum that has this value
		const enumKey = Object.keys(ApplicableEntity).find(
			(key) => ApplicableEntity[key as keyof typeof ApplicableEntity] === entity
		);
		return enumKey || entity.toUpperCase();
	});
};

/**
 * Gets all available applicable entities
 * Useful for populating dropdowns/selects
 *
 * @returns Array of all ApplicableEntity values
 */
export const getAllApplicableEntities = (): ApplicableEntity[] => {
	return Object.values(ApplicableEntity).filter(
		(value): value is ApplicableEntity => typeof value === "string"
	);
};
