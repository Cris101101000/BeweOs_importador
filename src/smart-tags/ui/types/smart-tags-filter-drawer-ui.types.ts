import type { SmartTagsTableFilters } from "../../domain/interfaces/smart-tags-interface";
import type {
	DateRangeFilters,
	OriginFilters,
	StatusFilters,
	TypeFilters,
	UsageRangeFilters,
} from "../../domain/types/smart-tags-filter-drawer.types";

/**
 * Props del componente SmartTagsFilterDrawer
 */
export interface SmartTagsFilterDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onApplyFilters: (filters: SmartTagsTableFilters) => void;
	currentFilters?: Partial<SmartTagsTableFilters>;
	isLoading?: boolean;
}

/**
 * Estado interno del drawer de filtros de smart tags
 */
export interface SmartTagsFilterDrawerState {
	status: StatusFilters;
	type: TypeFilters;
	origin: OriginFilters;
	usageRange: UsageRangeFilters;
	dateRange: DateRangeFilters;
	search?: string;
	hasChanges: boolean;
	expandedSections: {
		status: boolean;
		type: boolean;
		origin: boolean;
		usageRange: boolean;
		dateRange: boolean;
	};
}
