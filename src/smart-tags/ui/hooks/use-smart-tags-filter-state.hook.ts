import { useCallback, useEffect, useState } from "react";
import type { SmartTagStatus } from "../../domain/enums/smart-tag-status.enum";
import type {
	SmartTagsFilterDrawerProps,
	SmartTagsFilterDrawerState,
} from "../types/smart-tags-filter-drawer-ui.types";

/**
 * Custom hook para manejar el estado de los filtros de smart tags
 * Optimizado para performance con memoización y comparaciones inteligentes
 */
export const useSmartTagsFilterState = (
	currentFilters: SmartTagsFilterDrawerProps["currentFilters"],
	isOpen: boolean
) => {
	// Estado inicial basado en filtros actuales
	const getInitialState = useCallback(
		(): SmartTagsFilterDrawerState => ({
			status: {
				selectedStatuses: currentFilters?.status?.selectedStatuses || [],
			},
			type: {
				selectedTypes: currentFilters?.type?.selectedTypes || [],
			},
			origin: {
				selectedOrigins: currentFilters?.origin?.selectedOrigins || [],
			},
			usageRange: {
				min: currentFilters?.usageRange?.min,
				max: currentFilters?.usageRange?.max,
			},
			dateRange: {
				created: currentFilters?.dateRange?.created || null,
			},
			hasChanges: false,
			expandedSections: {
				status: true,
				type: false,
				origin: false,
				usageRange: false,
				dateRange: false,
			},
		}),
		[currentFilters]
	);

	const [state, setState] =
		useState<SmartTagsFilterDrawerState>(getInitialState);
	const [resetCounter, setResetCounter] = useState(0);

	// Resetear estado cuando se abra el drawer
	useEffect(() => {
		if (isOpen) {
			setState(getInitialState());
		}
	}, [getInitialState, isOpen]);

	// Función para contar filtros activos en cada sección
	const countActiveFilters = useCallback(
		(
			section: keyof Omit<
				SmartTagsFilterDrawerState,
				"hasChanges" | "expandedSections"
			>
		) => {
			switch (section) {
				case "status":
					return state.status.selectedStatuses.length;
				case "type":
					return state.type.selectedTypes.length;
				case "origin":
					return state.origin.selectedOrigins.length;
				case "usageRange":
					return state.usageRange.min !== undefined ||
						state.usageRange.max !== undefined
						? 1
						: 0;
				case "dateRange":
					return state.dateRange.created !== null ? 1 : 0;
				default:
					return 0;
			}
		},
		[state]
	);

	// Manejadores de cambios
	const handleStatusToggle = useCallback((status: SmartTagStatus) => {
		setState((prev) => {
			const selectedStatuses = prev.status.selectedStatuses.includes(status)
				? prev.status.selectedStatuses.filter((s) => s !== status)
				: [...prev.status.selectedStatuses, status];

			return {
				...prev,
				status: { selectedStatuses },
				hasChanges: true,
			};
		});
	}, []);

	const handleOriginToggle = useCallback((origin: "ai" | "manual") => {
		setState((prev) => {
			const selectedOrigins = prev.origin.selectedOrigins.includes(origin)
				? prev.origin.selectedOrigins.filter((o) => o !== origin)
				: [...prev.origin.selectedOrigins, origin];

			return {
				...prev,
				origin: { selectedOrigins },
				hasChanges: true,
			};
		});
	}, []);

	const handleUsageRangeChange = useCallback((min?: number, max?: number) => {
		setState((prev) => ({
			...prev,
			usageRange: { min, max },
			hasChanges: true,
		}));
	}, []);

	const toggleSection = useCallback(
		(section: keyof typeof state.expandedSections) => {
			setState((prev) => ({
				...prev,
				expandedSections: {
					...prev.expandedSections,
					[section]: !prev.expandedSections[section],
				},
			}));
		},
		[]
	);

	const resetFilters = useCallback(() => {
		setState((prev) => ({
			...getInitialState(),
			expandedSections: prev.expandedSections,
		}));
		setResetCounter((prev) => prev + 1);
	}, [getInitialState]);

	return {
		state,
		resetCounter,
		countActiveFilters,
		handleStatusToggle,
		handleOriginToggle,
		handleUsageRangeChange,
		toggleSection,
		resetFilters,
	};
};
