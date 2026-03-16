import type { ApplicableEntity } from "../../domain/enums/applicable-entity.enum.ts";
import type { ISmartTag } from "../../domain/interfaces/smart-tags-interface.ts";

/**
 * Helper function to compare two arrays of ApplicableEntity
 * Returns true if arrays contain the same elements (order doesn't matter)
 */
const areApplicableEntitiesEqual = (
	arr1: ApplicableEntity[],
	arr2: ApplicableEntity[]
): boolean => {
	if (arr1.length !== arr2.length) return false;
	const sorted1 = [...arr1].sort();
	const sorted2 = [...arr2].sort();
	return JSON.stringify(sorted1) === JSON.stringify(sorted2);
};

/**
 * Utility function to detect which fields have been modified between original and updated data
 */
export const getModifiedFields = (
	original: ISmartTag,
	updated: Partial<ISmartTag>
): Partial<ISmartTag> => {
	const modifiedFields: Partial<ISmartTag> = {};

	// Check basic fields
	if (updated.name !== undefined && updated.name !== original.name) {
		modifiedFields.name = updated.name;
	}

	if (
		updated.description !== undefined &&
		updated.description !== original.description
	) {
		modifiedFields.description = updated.description;
	}

	if (updated.keywords !== undefined) {
		// Compare arrays by converting to strings
		const originalKeywords = JSON.stringify(original.keywords.sort());
		const updatedKeywords = JSON.stringify([...updated.keywords].sort());
		if (originalKeywords !== updatedKeywords) {
			modifiedFields.keywords = updated.keywords;
		}
	}

	if (updated.color !== undefined && updated.color !== original.color) {
		modifiedFields.color = updated.color;
	}

	if (updated.type !== undefined && updated.type !== original.type) {
		modifiedFields.type = updated.type;
	}

	if (updated.status !== undefined && updated.status !== original.status) {
		modifiedFields.status = updated.status;
	}

	// Check applicableEntities array
	if (updated.applicableEntities !== undefined) {
		if (
			!areApplicableEntitiesEqual(
				original.applicableEntities,
				updated.applicableEntities
			)
		) {
			modifiedFields.applicableEntities = updated.applicableEntities;
		}
	}

	if (
		updated.isTemporary !== undefined &&
		updated.isTemporary !== original.isTemporary
	) {
		modifiedFields.isTemporary = updated.isTemporary;
	}

	if (updated.temporaryDuration !== undefined) {
		// Compare considering null/undefined as equal
		const originalDuration = original.temporaryDuration ?? null;
		const updatedDuration = updated.temporaryDuration ?? null;
		if (originalDuration !== updatedDuration) {
			modifiedFields.temporaryDuration = updated.temporaryDuration;
		}
	}

	return modifiedFields;
};

/**
 * Check if there are any modified fields
 */
export const hasModifiedFields = (
	modifiedFields: Partial<ISmartTag>
): boolean => {
	return Object.keys(modifiedFields).length > 0;
};
