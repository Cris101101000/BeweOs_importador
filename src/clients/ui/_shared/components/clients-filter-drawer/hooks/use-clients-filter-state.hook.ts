import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { EnumPotentialClient } from "@clients/domain/enums/potential.enum";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import { useCallback, useEffect, useState } from "react";
import type { DateFilterSectionValue } from "../../date-filter-section/date-filter-section.types";
import type {
	ClientsFilterDrawerProps,
	ClientsFilterDrawerState,
	DateFilters,
} from "../clients-filter-drawer.types";

/**
 * Custom hook para manejar el estado de los filtros de clientes
 * Optimizado para performance con memoización y comparaciones inteligentes
 */
export const useClientsFilterState = (
	currentFilters: ClientsFilterDrawerProps["currentFilters"],
	isOpen: boolean
) => {
	// Estado inicial basado en filtros actuales
	const getInitialState = useCallback(
		(): ClientsFilterDrawerState => ({
			dates: {
				lastCommunication: currentFilters?.dates?.lastCommunication || null,
				birthdate: currentFilters?.dates?.birthdate || null,
				registered: currentFilters?.dates?.registered || null,
			},
			status: {
				selectedStatuses: currentFilters?.status?.selectedStatuses || [],
			},
			potential: {
				selectedPotentials: currentFilters?.potential?.selectedPotentials || [],
			},
			aiTags: {
				selectedTags: currentFilters?.aiTags?.selectedTags || [],
				tagSearchQuery: currentFilters?.aiTags?.tagSearchQuery || "",
			},
			hasChanges: false,
			expandedSections: {
				dates: true,
				status: false,
				potential: false,
				aiTags: false,
			},
		}),
		[currentFilters]
	);

	const [state, setState] = useState<ClientsFilterDrawerState>(getInitialState);
	const [resetCounter, setResetCounter] = useState(0);

	// Resetear estado cuando se abra el modal
	useEffect(() => {
		if (isOpen) {
			setState(getInitialState());
		}
	}, [getInitialState, isOpen]);

	// Función para contar filtros activos en cada sección
	const countActiveFilters = useCallback(
		(
			section: keyof Omit<
				ClientsFilterDrawerState,
				"hasChanges" | "expandedSections"
			>
		) => {
			switch (section) {
				case "dates":
					return Object.values(state.dates).filter((value) => value !== null)
						.length;
				case "status":
					return state.status.selectedStatuses.length;
				case "potential":
					return state.potential.selectedPotentials.length;
				case "aiTags":
					return state.aiTags.selectedTags.length;
				default:
					return 0;
			}
		},
		[state]
	);

	// Manejadores de cambios
	const handleDateChange = useCallback(
		(field: keyof DateFilters, value: DateFilterSectionValue) => {
			setState((prev) => ({
				...prev,
				dates: {
					...prev.dates,
					[field]: value.date || value.dateRange || null,
				},
				hasChanges: true,
			}));
		},
		[]
	);

	const handleStatusToggle = useCallback((status: EnumClientStatus) => {
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

	const handlePotentialToggle = useCallback(
		(potential: EnumPotentialClient) => {
			setState((prev) => {
				const selectedPotentials = prev.potential.selectedPotentials.includes(
					potential
				)
					? prev.potential.selectedPotentials.filter((p) => p !== potential)
					: [...prev.potential.selectedPotentials, potential];

				return {
					...prev,
					potential: { selectedPotentials },
					hasChanges: true,
				};
			});
		},
		[]
	);

	const handleTagToggle = useCallback((tag: IAiTag) => {
		setState((prev) => {
			const isSelected = prev.aiTags.selectedTags.some(
				(selectedTag) =>
					selectedTag.value === tag.value ||
					(tag.id && selectedTag.id === tag.id)
			);

			const selectedTags = isSelected
				? prev.aiTags.selectedTags.filter(
						(t) => t.value !== tag.value && !(tag.id && t.id === tag.id)
					)
				: [...prev.aiTags.selectedTags, tag];

			return {
				...prev,
				aiTags: { ...prev.aiTags, selectedTags },
				hasChanges: true,
			};
		});
	}, []);

	const handleTagSearch = useCallback((query: string) => {
		setState((prev) => ({
			...prev,
			aiTags: { ...prev.aiTags, tagSearchQuery: query },
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
		handleDateChange,
		handleStatusToggle,
		handlePotentialToggle,
		handleTagToggle,
		handleTagSearch,
		toggleSection,
		resetFilters,
	};
};
