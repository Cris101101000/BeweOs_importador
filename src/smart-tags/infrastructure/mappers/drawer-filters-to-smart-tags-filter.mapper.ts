import type { SmartTagsFilters } from "../adapters/smart-tags.adapter.ts";

/**
 * Maps DrawerFilters format to SmartTagsFilters (API format)
 * @param drawerFilters - Raw filters from DrawerFilters component
 * @returns SmartTagsFilters - API-formatted filters
 */
export const mapDrawerFiltersToSmartTagsFilter = (
	drawerFilters: Record<string, any>
): Partial<SmartTagsFilters> => {
	const apiFilters: Partial<SmartTagsFilters> = {};

	// Map status filter (multiselect - array of statuses)
	if (drawerFilters.status) {
		if (
			Array.isArray(drawerFilters.status) &&
			drawerFilters.status.length > 0
		) {
			// For multiselect, send as array - adapter will handle multiple query params
			apiFilters.status = drawerFilters.status;
		} else if (typeof drawerFilters.status === "string") {
			apiFilters.status = drawerFilters.status;
		}
	}

	// Map sourceType filter (single select)
	if (drawerFilters.sourceType) {
		apiFilters.sourceType = drawerFilters.sourceType;
	}

	// Map usageCount range filter
	if (drawerFilters.usageCount) {
		// Range filters come as "min-max" string format
		if (typeof drawerFilters.usageCount === "string") {
			const [min, max] = drawerFilters.usageCount.split("-").map(Number);
			if (!isNaN(min)) {
				apiFilters.usageCountMin = min;
			}
			if (!isNaN(max)) {
				apiFilters.usageCountMax = max;
			}
		} else if (typeof drawerFilters.usageCount === "object") {
			// Handle object format { min: number, max: number }
			if (drawerFilters.usageCount.min !== undefined) {
				apiFilters.usageCountMin = Number(drawerFilters.usageCount.min);
			}
			if (drawerFilters.usageCount.max !== undefined) {
				apiFilters.usageCountMax = Number(drawerFilters.usageCount.max);
			}
		}
	}

	return apiFilters;
};

/**
 * Counts the number of active filters in API format
 * @param apiFilters - API formatted filters
 * @returns Number of active filters
 */
export const countActiveSmartTagsFilters = (
	apiFilters: Partial<SmartTagsFilters>
): number => {
	let count = 0;

	// Count status filter
	if (apiFilters.status) {
		if (Array.isArray(apiFilters.status) && apiFilters.status.length > 0) {
			count++;
		} else if (
			typeof apiFilters.status === "string" &&
			apiFilters.status.trim().length > 0
		) {
			count++;
		}
	}

	// Count sourceType filter
	if (apiFilters.sourceType) {
		count++;
	}

	// Count usage range filters
	if (
		apiFilters.usageCountMin !== undefined ||
		apiFilters.usageCountMax !== undefined
	) {
		count++;
	}

	return count;
};

/**
 * Counts active filters in any format (flexible)
 * @param filters - Filters in any format
 * @returns Number of active filters
 */
export const countActiveFiltersFlexible = (filters: any): number => {
	if (!filters) return 0;

	let count = 0;

	// Check for API format filters
	if (
		filters.status &&
		(typeof filters.status === "string"
			? filters.status.trim().length > 0
			: true)
	) {
		count++;
	}
	if (filters.sourceType) {
		count++;
	}
	if (
		filters.usageCountMin !== undefined ||
		filters.usageCountMax !== undefined
	) {
		count++;
	}

	// Check for drawer format filters
	if (
		filters.status &&
		Array.isArray(filters.status) &&
		filters.status.length > 0
	) {
		count++;
	}
	if (
		filters.usageCount &&
		(typeof filters.usageCount === "string" ||
			typeof filters.usageCount === "object")
	) {
		count++;
	}

	return count;
};
