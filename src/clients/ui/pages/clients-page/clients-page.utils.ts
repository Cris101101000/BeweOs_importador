/**
 * Utility functions for ClientsPage component
 */

import { PAGINATION } from "@clients/domain/constants/pagination.constants";
import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";

/**
 * Creates updated filters for newly created clients
 * Optimized for performance and reusability
 * @returns IClientFilter with pagination defaults
 */
export const createUpdatedFiltersForNewClient = (): IClientFilter => {
	return {
		limit: PAGINATION.limit,
		offset: 0,
	};
};

/**
 * Creates a callback for handling client creation with optimized filter updates
 * @param updateClientFilters - Function to update client filters
 * @returns Optimized callback function
 */
export const createClientCreatedHandler = (
	updateClientFilters: (filters: IClientFilter) => void
) => {
	return () => {
		const updatedFilters = createUpdatedFiltersForNewClient();
		updateClientFilters(updatedFilters);
	};
};
