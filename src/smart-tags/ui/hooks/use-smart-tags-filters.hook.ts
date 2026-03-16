/**
 * SmartTagsFiltersContext - Context for managing filter state across smart tags views
 *
 * This context provides shared filter state and functions for:
 * - Managing applied filters
 * - Opening/closing filter drawer
 * - Applying new filters
 * - Resetting filters
 */

import React, {
	createContext,
	useCallback,
	useContext,
	useState,
} from 'react';
import type { ISmartTag, SmartTagsTableFilters } from '../../domain/interfaces/smart-tags-interface';

/**
 * Interface defining the shape of the filters context
 */
interface SmartTagsFiltersContextValue {
	/** Currently applied filters */
	appliedFilters: Partial<SmartTagsTableFilters>;
	/** Whether the filter drawer is open */
	isFilterOpen: boolean;
	/** Opens the filter drawer */
	handleOpenFilterDrawer: () => void;
	/** Closes the filter drawer */
	handleCloseFilterDrawer: () => void;
	/** Applies filters and closes drawer */
	handleApplyFilters: (filters: Partial<SmartTagsTableFilters>) => void;
	/** Resets all applied filters */
	handleResetFilters: () => void;
	/** Checks if any filters are currently applied */
	hasActiveFilters: boolean;
	/** Smart tags data */
	smartTagsResult: ISmartTag[];
	/** Loading state for smart tags data */
	isLoadingTags: boolean;
	/** Refetch smart tags data */
	refetchTags: () => Promise<void>;
	/** Handle pagination */
	getPage?: (page: number, pageSize?: number) => void;
}

/**
 * Context for filters state management
 */
const SmartTagsFiltersContext = createContext<SmartTagsFiltersContextValue | undefined>(
	undefined
);

/**
 * Props for the SmartTagsFiltersProvider component
 */
interface SmartTagsFiltersProviderProps {
	children: React.ReactNode;
	/** Required smart tags data to avoid duplicate API calls - must be provided by parent */
	smartTagsData: {
		result: ISmartTag[];
		isLoading: boolean;
		refetch: () => Promise<void>;
	};
	/** Function to apply filters from parent component */
	onApplyFilters: (filters: Partial<SmartTagsTableFilters>) => void;
	/** Function to reset filters from parent component */
	onResetFilters: () => void;
	/** Currently applied filters from parent component */
	appliedFilters: Partial<SmartTagsTableFilters>;
	/** Function to handle pagination from parent component */
	getPage?: (page: number, pageSize?: number) => void;
}

/**
 * Provider component that manages filter state and provides it to children
 */
export const SmartTagsFiltersProvider: React.FC<SmartTagsFiltersProviderProps> = ({
	children,
	smartTagsData,
	onApplyFilters,
	onResetFilters,
	appliedFilters,
	getPage,
}) => {
	// State for filter drawer visibility
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	// Always use provided smart tags data - no internal fetching to avoid duplicates
	if (!smartTagsData) {
		throw new Error(
			'SmartTagsFiltersProvider requires smartTagsData prop to avoid duplicate API calls. ' +
				'Pass smartTagsData from parent component that manages the main smart tags fetch.'
		);
	}

	const smartTagsResult = smartTagsData.result;
	const isLoadingTags = smartTagsData.isLoading;
	const refetchTags = smartTagsData.refetch;

	/**
	 * Opens the filter drawer
	 */
	const handleOpenFilterDrawer = useCallback(() => {
		setIsFilterOpen(true);
	}, []);

	/**
	 * Closes the filter drawer
	 */
	const handleCloseFilterDrawer = useCallback(() => {
		setIsFilterOpen(false);
	}, []);

	/**
	 * Applies filters and closes the drawer
	 * @param filters - The filters to apply
	 */
	const handleApplyFilters = useCallback(
		(filters: Partial<SmartTagsTableFilters>) => {
			setIsFilterOpen(false);
			// Merge with current filters and delegate to parent component
			const mergedFilters = {
				...appliedFilters,
				...filters,
			} as SmartTagsTableFilters;
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
	 * Determines if any filters are currently applied
	 */
	const hasActiveFilters = React.useMemo(() => {
		return (
			Object.keys(appliedFilters).length > 0 &&
			Object.values(appliedFilters).some((value) => {
				if (value === undefined || value === null) return false;
				if (Array.isArray(value)) return value.length > 0;
				if (typeof value === 'string') return value !== '';
				if (typeof value === 'object' && value !== null) {
					return Object.values(value).some(
						(v) => v !== undefined && v !== null && v !== ''
					);
				}
				return true;
			})
		);
	}, [appliedFilters]);

	const contextValue: SmartTagsFiltersContextValue = {
		appliedFilters,
		isFilterOpen,
		handleOpenFilterDrawer,
		handleCloseFilterDrawer,
		handleApplyFilters,
		handleResetFilters: handleResetFiltersInternal,
		hasActiveFilters,
		smartTagsResult,
		isLoadingTags,
		refetchTags,
		getPage,
	};

	return (
		<SmartTagsFiltersContext.Provider value={contextValue}>
			{children}
		</SmartTagsFiltersContext.Provider>
	)
};

/**
 * Custom hook to access the smart tags filters context
 *
 * @throws Error if used outside of SmartTagsFiltersProvider
 * @returns SmartTagsFiltersContextValue
 *
 * @example
 * ```tsx
 * const { appliedFilters, handleOpenFilterDrawer } = useSmartTagsFilters();
 * ```
 */
export const useSmartTagsFilters = (): SmartTagsFiltersContextValue => {
	const context = useContext(SmartTagsFiltersContext);

	if (context === undefined) {
		throw new Error('useSmartTagsFilters must be used within a SmartTagsFiltersProvider');
	}

	return context;
};