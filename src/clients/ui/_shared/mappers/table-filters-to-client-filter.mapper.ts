import type { DateValue, RangeValue } from "@beweco/aurora-ui";
import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import type { ClientsTableFilters } from "@clients/ui/_shared/components/clients-filter-drawer/clients-filter-drawer.types";
import { getEndOfDayUTC } from "@shared/utils/date-range.utils";

/**
 * Converts UI TableFilters to domain IClientFilter
 * @param tableFilters - Filters from the UI components
 * @returns IClientFilter - Domain filter interface
 */
export const tableFiltersToClientFilter = (
	tableFilters: Partial<ClientsTableFilters>
): IClientFilter => {
	const clientFilter: IClientFilter = {};

	// Map status filters
	if (tableFilters.status?.selectedStatuses?.length) {
		clientFilter.status = tableFilters.status.selectedStatuses;
	}

	// Map search filter
	if (tableFilters.search?.trim()) {
		clientFilter.search = tableFilters.search.trim();
	}

	// Map AI tags filters
	if (tableFilters.aiTags?.selectedTags?.length) {
		clientFilter.tags = tableFilters.aiTags.selectedTags
			.map((tag) => tag.id || tag.value)
			.filter((tag) => tag && tag.trim().length > 0); // Filter out empty strings
	}

	// Map potential filters
	if (tableFilters.potential?.selectedPotentials?.length) {
		clientFilter.potential = tableFilters.potential.selectedPotentials;
	}

	// Map order filter
	if (tableFilters.order) {
		clientFilter.order = tableFilters.order;
	}

	// Map date filters
	if (tableFilters.dates) {
		// Map registered date (created date) - dates.registered → createdDateFrom/createdDateTo
		if (tableFilters.dates.registered) {
			const registeredRange = extractDateRange(tableFilters.dates.registered);
			if (registeredRange.from) {
				clientFilter.createdDateFrom = registeredRange.from;
			}
			if (registeredRange.to) {
				clientFilter.createdDateTo = getEndOfDayUTC(registeredRange.to);
			}
		}

		// Map birthdate - dates.birthdate → birthdateFrom/birthdateTo
		if (tableFilters.dates.birthdate) {
			const birthdateRange = extractDateRange(tableFilters.dates.birthdate);
			if (birthdateRange.from) {
				clientFilter.birthdateFrom = birthdateRange.from;
			}
			if (birthdateRange.to) {
				clientFilter.birthdateTo = getEndOfDayUTC(birthdateRange.to);
			}
		}

		// Map lastCommunication - dates.lastCommunication → lastCommunicationFrom/lastCommunicationTo
		// "to" is end of day (23:59:59.999 UTC) so a single day covers 00:00–23:59
		if (tableFilters.dates.lastCommunication) {
			const lastCommRange = extractDateRange(
				tableFilters.dates.lastCommunication
			);
			if (lastCommRange.from) {
				clientFilter.lastCommunicationFrom = lastCommRange.from;
			}
			if (lastCommRange.to) {
				clientFilter.lastCommunicationTo =
					getEndOfDayUTC(lastCommRange.to);
			}
		}
	}

	return clientFilter;
};

/**
 * Parses a date string that can be in two formats:
 * - "YYYY-MM-DD-YYYY-MM-DD" (range: from-to)
 * - "YYYY-MM-DD" (single date)
 * @param dateString - String with date(s)
 * @returns Object with from and to dates
 */
const parseDateString = (
	dateString: string | null | undefined
): { from?: Date; to?: Date } => {
	if (!dateString || typeof dateString !== "string") return {};

	// Check if it's a range format: "YYYY-MM-DD-YYYY-MM-DD"
	const rangeMatch = dateString.match(
		/^(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})$/
	);
	if (rangeMatch) {
		const [, fromStr, toStr] = rangeMatch;
		return {
			from: new Date(fromStr),
			to: new Date(toStr),
		};
	}

	// Check if it's a single date format: "YYYY-MM-DD"
	const singleDateMatch = dateString.match(/^\d{4}-\d{2}-\d{2}$/);
	if (singleDateMatch) {
		const date = new Date(dateString);
		return {
			from: date,
			to: date,
		};
	}

	return {};
};

/**
 * Extracts date range from DateValue or RangeValue or string
 * Handles multiple formats: DateValue, RangeValue, or parsed string
 * @param dateValue - Single date, date range from UI, or string in format "YYYY-MM-DD" or "YYYY-MM-DD-YYYY-MM-DD"
 * @returns Object with from and to dates
 */
const extractDateRange = (
	dateValue: DateValue | RangeValue<DateValue> | string | null
): { from?: Date; to?: Date } => {
	if (!dateValue) return {};

	// Handle string format (e.g., "2025-10-20-2025-10-25" or "2025-10-20")
	if (typeof dateValue === "string") {
		return parseDateString(dateValue);
	}

	// Handle range value object
	if (typeof dateValue === "object" && "start" in dateValue) {
		const range = dateValue as RangeValue<DateValue>;
		return {
			from: range.start ? new Date(range.start.toString()) : undefined,
			to: range.end ? new Date(range.end.toString()) : undefined,
		};
	}

	// Handle single date value object
	if (dateValue) {
		const date = new Date(dateValue.toString());
		return {
			from: date,
			to: date,
		};
	}

	return {};
};
