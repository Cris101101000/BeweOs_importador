/**
 * FiltersContainer Component
 *
 * Internal component that renders the ClientsFilterDrawer using the filters context.
 * This component needs to be inside the FiltersProvider to access the context.
 *
 * @component
 * @example
 * ```tsx
 * <FiltersProvider>
 *   <FiltersContainer />
 * </FiltersProvider>
 * ```
 */

import type React from "react";
import { useFilters } from "@clients/ui/_shared/contexts/filters.context";
import { ClientsFilterDrawer } from "../clients-filter-drawer/clients-filter-drawer.component";

export const FiltersContainer: React.FC = () => {
	const {
		isFilterOpen,
		handleCloseFilterModal,
		handleApplyFilters,
		appliedFilters,
		availableTags,
	} = useFilters();

	return (
		<ClientsFilterDrawer
			isOpen={isFilterOpen}
			onClose={handleCloseFilterModal}
			onApplyFilters={handleApplyFilters}
			currentFilters={appliedFilters}
			availableTags={availableTags}
			isLoading={false}
		/>
	);
};
