import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { EnumPotentialClient } from "@clients/domain/enums/potential.enum";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type { ClientsTableFilters } from "@clients/ui/_shared/components/clients-filter-drawer/clients-filter-drawer.types";

/**
 * Maps DrawerFilters format to ClientsTableFilters format
 * @param drawerFilters - Raw filters from DrawerFilters component
 * @param availableTags - List of available AI tags for mapping tag IDs to tag objects
 * @returns ClientsTableFilters - Internal client filters format
 */
export const mapDrawerFiltersToClientsFilter = (
	drawerFilters: Record<string, any>,
	availableTags: IAiTag[] = []
): ClientsTableFilters => {
	const filters: ClientsTableFilters = {
		dates: {},
		status: {
			selectedStatuses: [],
		},
		potential: {
			selectedPotentials: [],
		},
		aiTags: {
			selectedTags: [],
			tagSearchQuery: "",
		},
	};

	// Map status filter
	if (drawerFilters.status) {
		if (typeof drawerFilters.status === "string") {
			// Single status
			filters.status.selectedStatuses = [
				drawerFilters.status as EnumClientStatus,
			];
		} else if (Array.isArray(drawerFilters.status)) {
			// Multiple statuses
			filters.status.selectedStatuses =
				drawerFilters.status as EnumClientStatus[];
		}
	}

	// Map potential filter
	if (drawerFilters.potential) {
		if (typeof drawerFilters.potential === "string") {
			// Single potential
			filters.potential.selectedPotentials = [
				drawerFilters.potential as EnumPotentialClient,
			];
		} else if (Array.isArray(drawerFilters.potential)) {
			// Multiple potentials
			filters.potential.selectedPotentials =
				drawerFilters.potential as EnumPotentialClient[];
		}
	}

	// Map AI tags filter
	if (drawerFilters.aiTags) {
		// Handle both string and array formats
		const tagIds = Array.isArray(drawerFilters.aiTags)
			? drawerFilters.aiTags
			: typeof drawerFilters.aiTags === "string"
				? [drawerFilters.aiTags]
				: [];

		// Map tag IDs to tag objects
		filters.aiTags.selectedTags = tagIds
			.map((tagId) =>
				availableTags.find(
					(tag) =>
						tag.id === tagId || (tag.id === undefined && tag.value === tagId)
				)
			)
			.filter((tag): tag is IAiTag => tag !== undefined);
	}

	// Map date filters
	if (drawerFilters.lastCommunication) {
		filters.dates.lastCommunication = drawerFilters.lastCommunication as any;
	}

	if (drawerFilters.birthdate) {
		filters.dates.birthdate = drawerFilters.birthdate as any;
	}

	if (drawerFilters.registered) {
		filters.dates.registered = drawerFilters.registered as any;
	}

	return filters;
};

/**
 * Maps ClientsTableFilters to DrawerFilters format
 * This is used to pre-populate the DrawerFilters with existing filter values
 * @param clientsFilters - ClientsTableFilters from internal state
 * @returns Record<string, any> - DrawerFilters format
 */
export const mapClientsFilterToDrawerFilters = (
	clientsFilters: Partial<ClientsTableFilters>
): Record<string, any> => {
	const drawerFilters: Record<string, any> = {};

	// Map status
	if (clientsFilters.status?.selectedStatuses?.length) {
		drawerFilters.status = clientsFilters.status.selectedStatuses;
	}

	// Map potential
	if (clientsFilters.potential?.selectedPotentials?.length) {
		drawerFilters.potential = clientsFilters.potential.selectedPotentials;
	}

	// Map AI tags
	if (clientsFilters.aiTags?.selectedTags?.length) {
		drawerFilters.aiTags = clientsFilters.aiTags.selectedTags.map(
			(tag) => tag.id
		);
	}

	// Map dates
	if (clientsFilters.dates) {
		if (clientsFilters.dates.lastCommunication) {
			drawerFilters.lastCommunication = clientsFilters.dates.lastCommunication;
		}
		if (clientsFilters.dates.birthdate) {
			drawerFilters.birthdate = clientsFilters.dates.birthdate;
		}
		if (clientsFilters.dates.registered) {
			drawerFilters.registered = clientsFilters.dates.registered;
		}
	}

	return drawerFilters;
};

/**
 * Counts active filters in DrawerFilters format
 * @param drawerFilters - DrawerFilters format filters
 * @returns Number of active filters
 */
export const countActiveFilters = (
	drawerFilters: Record<string, any>
): number => {
	let count = 0;

	for (const [Key, value] of Object.entries(drawerFilters)) {
		if (value === null || value === undefined) continue;

		if (Array.isArray(value) && value.length > 0) {
			count++;
		} else if (typeof value === "string" && value.trim().length > 0) {
			count++;
		} else if (typeof value === "object") {
			// Check if it's a date object with start/end
			if ("start" in value || "end" in value) {
				count++;
			}
		} else if (typeof value === "number") {
			count++;
		}
	}

	return count;
};

/**
 * Counts active filters in ClientsTableFilters format (internal format)
 * Similar to countActiveFiltersFlexible in catalog, but for clients filters
 * @param filters - ClientsTableFilters or partial filters
 * @returns Number of active filters
 */
export const countActiveClientsFilters = (
	filters: Partial<ClientsTableFilters> | null | undefined
): number => {
	if (!filters) return 0;

	let count = 0;

	// Count status filters
	if (filters.status?.selectedStatuses?.length) {
		count++;
	}

	// Count potential filters
	if (filters.potential?.selectedPotentials?.length) {
		count++;
	}

	// Count AI tags filters
	if (filters.aiTags?.selectedTags?.length) {
		count++;
	}

	// Count date filters (each date filter counts as one)
	if (filters.dates) {
		if (filters.dates.lastCommunication) {
			count++;
		}
		if (filters.dates.birthdate) {
			count++;
		}
		if (filters.dates.registered) {
			count++;
		}
	}

	return count;
};
