/**
 * FiltersContext - Context for managing filter state across client views
 *
 * This context provides shared filter state and functions for:
 * - Managing applied filters
 * - Opening/closing filter modal
 * - Applying new filters
 * - Resetting filters
 *
 * Can be used from both Table and Kanban views to maintain consistent filter state.
 */

import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type { IClientResponse } from "@clients/domain/interfaces/client.interface";
import type { ClientsTableFilters } from "@clients/ui/_shared/components/clients-filter-drawer/clients-filter-drawer.types";
import { countActiveClientsFilters } from "@clients/ui/_shared/mappers/drawer-filters-to-clients-filter.mapper";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

/**
 * Interface defining the shape of the filters context
 */
interface FiltersContextValue {
	/** Currently applied filters */
	appliedFilters: Partial<ClientsTableFilters>;
	/** Whether the filter modal is open */
	isFilterOpen: boolean;
	/** Sets the applied filters */
	setAppliedFilters: (filters: Partial<ClientsTableFilters>) => void;
	/** Opens the filter modal */
	handleOpenFilterModal: () => void;
	/** Closes the filter modal */
	handleCloseFilterModal: () => void;
	/** Applies filters and closes modal */
	handleApplyFilters: (filters: Partial<ClientsTableFilters>) => void;
	/** Resets all applied filters */
	handleResetFilters: () => void;
	/** Checks if any filters are currently applied */
	hasActiveFilters: boolean;
	/** Available tags for filtering */
	availableTags: IAiTag[];
	/** Updates the available tags */
	setAvailableTags: (tags: IAiTag[]) => void;
	/** Clients data from the use case */
	clientsResult: IClientResponse | null;
	/** Loading state for clients data */
	isLoadingClients: boolean;
	/** Error state for clients data */
	clientsError: Error | null;
	/** Refetch clients data */
	refetchClients: () => Promise<void>;
	/** Handle pagination */
	getPage?: (page: number, pageSize?: number) => void;
}

/**
 * Context for filters state management
 */
const FiltersContext = createContext<FiltersContextValue | undefined>(
	undefined
);

/**
 * Props for the FiltersProvider component
 */
interface FiltersProviderProps {
	children: React.ReactNode;
	/** Available tags for filtering - can be passed from parent */
	availableTags?: IAiTag[];
	/** Required clients data to avoid duplicate API calls - must be provided by parent */
	clientsData: {
		result: IClientResponse | null;
		isLoading: boolean;
		error: Error | null;
		refetch: () => Promise<void>;
	};
	/** Function to apply filters from parent component */
	onApplyFilters: (filters: Partial<ClientsTableFilters>) => void;
	/** Function to reset filters from parent component */
	onResetFilters: () => void;
	/** Currently applied filters from parent component */
	appliedFilters: Partial<ClientsTableFilters>;
	/** Function to handle pagination from parent component */
	getPage?: (page: number, pageSize?: number) => void;
}

/**
 * Provider component that manages filter state and provides it to children
 */
export const FiltersProvider: React.FC<FiltersProviderProps> = ({
	children,
	availableTags,
	clientsData,
	onApplyFilters,
	onResetFilters,
	appliedFilters,
	getPage,
}) => {
	// State for filter modal visibility
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	// State for available tags
	const [tags, setTags] = useState<IAiTag[]>(availableTags || []);

	// Update tags when availableTags prop changes
	useEffect(() => {
		if (availableTags) {
			setTags(availableTags);
		}
	}, [availableTags]);

	// Always use provided clients data - no internal fetching to avoid duplicates
	if (!clientsData) {
		throw new Error(
			"FiltersProvider requires clientsData prop to avoid duplicate API calls. " +
				"Pass clientsData from parent component that manages the main clients fetch."
		);
	}

	const clientsResult = clientsData.result;
	const isLoadingClients = clientsData.isLoading;
	const clientsError = clientsData.error;
	const refetchClients = clientsData.refetch;

	/**
	 * Opens the filter modal
	 */
	const handleOpenFilterModal = useCallback(() => {
		setIsFilterOpen(true);
	}, []);

	/**
	 * Closes the filter modal
	 */
	const handleCloseFilterModal = useCallback(() => {
		setIsFilterOpen(false);
	}, []);

	/**
	 * Applies filters and closes the modal
	 * @param filters - The filters to apply
	 */
	const handleApplyFilters = useCallback(
		(filters: Partial<ClientsTableFilters>) => {
			setIsFilterOpen(false);
			// Merge with current filters and delegate to parent component
			const mergedFilters = {
				...appliedFilters,
				...filters,
			} as ClientsTableFilters;
			onApplyFilters(mergedFilters);
		},
		[onApplyFilters, appliedFilters]
	);

	/**
	 * Resets all applied filters
	 * Delegates to parent component to handle filter reset
	 */
	const handleResetFiltersInternal = useCallback(() => {
		onResetFilters();
	}, [onResetFilters]);

	/**
	 * Updates the available tags
	 * @param newTags - Array of available tags
	 */
	const setAvailableTags = useCallback((newTags: IAiTag[]) => {
		setTags(newTags);
	}, []);

	/**
	 * Determines if any filters are currently applied
	 * Uses countActiveClientsFilters for consistent logic and also checks search field
	 */
	const hasActiveFilters = React.useMemo(() => {
		// Check if there's an active search
		const hasSearch =
			appliedFilters.search && appliedFilters.search.trim().length > 0;

		// Count other active filters using the same logic as the UI
		const activeFiltersCount = countActiveClientsFilters(appliedFilters);

		return hasSearch || activeFiltersCount > 0;
	}, [appliedFilters]);

	const contextValue: FiltersContextValue = {
		appliedFilters,
		isFilterOpen,
		setAppliedFilters: () => {
			console.warn("setAppliedFilters should be handled by parent component");
		},
		handleOpenFilterModal,
		handleCloseFilterModal,
		handleApplyFilters,
		handleResetFilters: handleResetFiltersInternal,
		hasActiveFilters,
		availableTags: tags,
		setAvailableTags,
		clientsResult,
		isLoadingClients,
		clientsError,
		refetchClients,
		getPage,
	};

	return (
		<FiltersContext.Provider value={contextValue}>
			{children}
		</FiltersContext.Provider>
	);
};

/**
 * Custom hook to access the filters context
 *
 * @throws Error if used outside of FiltersProvider
 * @returns FiltersContextValue
 *
 * @example
 * ```tsx
 * const { appliedFilters, handleOpenFilterModal } = useFilters();
 * ```
 */
export const useFilters = (): FiltersContextValue => {
	const context = useContext(FiltersContext);

	if (context === undefined) {
		throw new Error("useFilters must be used within a FiltersProvider");
	}

	return context;
};
