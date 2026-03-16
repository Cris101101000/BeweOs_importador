import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import type { ClientsTableFilters } from "@clients/ui/_shared/components/clients-filter-drawer/clients-filter-drawer.types";
import { convertDateRangeToDateValueRange } from "@shared/utils/aurora-date.utils";

/**
 * Converts domain IClientFilter to UI ClientsTableFilters
 * This is the inverse of tableFiltersToClientFilter
 * @param clientFilter - Domain filter interface
 * @returns ClientsTableFilters - UI filter interface
 */
export const clientFilterToTableFilters = (
	clientFilter: IClientFilter
): Partial<ClientsTableFilters> => {
	const tableFilters: Partial<ClientsTableFilters> = {};

	// Map status filters
	if (clientFilter.status?.length) {
		tableFilters.status = {
			selectedStatuses: clientFilter.status,
		};
	}

	// Map search filter
	if (clientFilter.search?.trim()) {
		tableFilters.search = clientFilter.search.trim();
	}

	if (clientFilter.potential?.length) {
		tableFilters.potential = {
			selectedPotentials: clientFilter.potential,
		};
	}

	// Map order filter
	if (clientFilter.order) {
		tableFilters.order = clientFilter.order;
	}

	// Map AI tags filters
	if (clientFilter.tags?.length) {
		// Filter out empty tags and convert string tags back to IAiTag objects
		const validTags = clientFilter.tags.filter(
			(tag) => tag && tag.trim().length > 0
		);
		if (validTags.length > 0) {
			tableFilters.aiTags = {
				selectedTags: validTags.map((tagValue) => ({
					id: tagValue, // Using value as ID for now
					value: tagValue,
					name: tagValue, // IAiTag doesn't have name property, but keeping for compatibility
				})),
				tagSearchQuery: "",
			};
		}
	}

	// Map date filters
	const dates: Partial<ClientsTableFilters["dates"]> = {};

	// Map created date range to registered date range using shared utility
	if (clientFilter.createdDateFrom || clientFilter.createdDateTo) {
		const registeredRange = convertDateRangeToDateValueRange(
			clientFilter.createdDateFrom,
			clientFilter.createdDateTo
		);
		if (registeredRange) {
			dates.registered = registeredRange;
		}
	}

	// Map birthdate range using shared utility
	if (clientFilter.birthdateFrom || clientFilter.birthdateTo) {
		const birthdateRange = convertDateRangeToDateValueRange(
			clientFilter.birthdateFrom,
			clientFilter.birthdateTo
		);
		if (birthdateRange) {
			dates.birthdate = birthdateRange;
		}
	}

	// Only add dates if we have any date filters
	if (Object.keys(dates).length > 0) {
		tableFilters.dates = dates as ClientsTableFilters["dates"];
	}

	return tableFilters;
};
