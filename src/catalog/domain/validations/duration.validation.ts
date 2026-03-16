import {
	DURATION_MAX_VALUES,
	EnumDurationType,
} from "../enums/duration-type.enum";

/**
 * Business rule: Maximum duration is 8 hours (480 minutes)
 * This is a pure business validation - returns boolean only
 */
export const isValidDuration = (
	value: number,
	type: EnumDurationType
): boolean => {
	if (value < 0) return false;

	const maxValue = DURATION_MAX_VALUES[type];
	return value <= maxValue;
};

/**
 * Gets the maximum allowed duration for a given type
 * Business rule: 8 hours max or 480 minutes max
 */
export const getMaxDuration = (type: EnumDurationType): number => {
	return DURATION_MAX_VALUES[type];
};

/**
 * Converts duration value to minutes for internal storage
 * Business rule: durations are stored in minutes
 */
export const convertToMinutes = (
	value: number,
	type: EnumDurationType
): number => {
	if (type === EnumDurationType.HOURS) {
		return value * 60;
	}
	return value;
};
