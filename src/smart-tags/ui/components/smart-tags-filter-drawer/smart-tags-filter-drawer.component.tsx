import {
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	H2,
	IconComponent,
	P,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback } from "react";
import type { SmartTagsTableFilters } from "../../../domain/interfaces/smart-tags-interface";
import { useSmartTagsFilters } from "../../contexts/smart-tags-filters.context";
import { useSmartTagsFilterState } from "../../hooks/use-smart-tags-filter-state.hook";
import type { SmartTagsFilterDrawerProps } from "../../types/smart-tags-filter-drawer-ui.types";
import {
	OriginFilterSection,
	StatusFilterSection,
	UsageRangeFilterSection,
} from "./_internal/index";

/**
 * SmartTagsFilterDrawer Component
 *
 * Drawer avanzado para filtrar la tabla de smart tags que incluye:
 * - Filtros por estado (activa, borrador, inactiva)
 * - Filtros por origen (AI/Manual)
 * - Filtros por rango de usos
 * - Secciones colapsables con contadores de filtros activos
 * - UX mejorada con indicadores visuales y estados
 * - Optimizado para rendimiento con memoización
 *
 * @param props - Props del componente SmartTagsFilterDrawer
 */
export const SmartTagsFilterDrawer: FC<SmartTagsFilterDrawerProps> = ({
	isOpen,
	onClose,
	onApplyFilters,
	currentFilters,
	isLoading = false,
}) => {
	const { t } = useTranslate();

	// Acceso al contexto de filtros para resetear completamente
	const { handleResetFilters: resetContextFilters } = useSmartTagsFilters();

	// Custom hook para manejar el estado de los filtros
	const {
		state,
		countActiveFilters,
		handleStatusToggle,
		handleOriginToggle,
		handleUsageRangeChange,
		toggleSection,
		resetFilters,
	} = useSmartTagsFilterState(currentFilters, isOpen);

	// Aplicar filtros
	const handleApplyFilters = useCallback(() => {
		const filters: SmartTagsTableFilters = {
			status: state.status,
			type: state.type,
			origin: state.origin,
			usageRange: state.usageRange,
			dateRange: state.dateRange,
		};
		// Filters applied successfully
		onApplyFilters(filters);
		onClose();
	}, [state, onApplyFilters, onClose]);

	// Resetear filtros completamente (tanto local como contexto)
	const handleCompleteReset = useCallback(() => {
		// 1. Resetear estado local del drawer
		resetFilters();

		// 2. Resetear filtros del contexto
		resetContextFilters();
	}, [resetFilters, resetContextFilters]);

	return (
		<Drawer isOpen={isOpen} onClose={onClose} size="lg" placement="right">
			<DrawerContent>
				<DrawerHeader className="flex flex-col pb-2">
					<div className="flex flex-col mt-4">
						<H2>{t("smart_tags_filter_modal_title", "Filtrar Etiquetas")}</H2>
						<P>
							{t(
								"smart_tags_filter_modal_description",
								"Filtra las etiquetas inteligentes por diferentes criterios"
							)}
						</P>
					</div>
				</DrawerHeader>

				<DrawerBody className="px-6 overflow-y-auto">
					<Button
						variant="light"
						size="sm"
						onPress={handleCompleteReset}
						startContent={<IconComponent icon="solar:restart-outline" />}
						isDisabled={isLoading}
						className="w-fit self-end"
					>
						{t("smart_tags_filter_reset", "Restablecer")}
					</Button>

					{/* Sección de Estado */}
					<StatusFilterSection
						selectedStatuses={state.status.selectedStatuses}
						isExpanded={state.expandedSections.status}
						activeFiltersCount={countActiveFilters("status")}
						onToggleExpanded={() => toggleSection("status")}
						onStatusToggle={handleStatusToggle}
					/>

					{/* Sección de Origen */}
					<OriginFilterSection
						selectedOrigins={state.origin.selectedOrigins}
						isExpanded={state.expandedSections.origin}
						activeFiltersCount={countActiveFilters("origin")}
						onToggleExpanded={() => toggleSection("origin")}
						onOriginToggle={handleOriginToggle}
					/>

					{/* Sección de Rango de Usos */}
					<UsageRangeFilterSection
						min={state.usageRange.min}
						max={state.usageRange.max}
						isExpanded={state.expandedSections.usageRange}
						activeFiltersCount={countActiveFilters("usageRange")}
						onToggleExpanded={() => toggleSection("usageRange")}
						onRangeChange={handleUsageRangeChange}
					/>
				</DrawerBody>

				<DrawerFooter className="flex gap-2 pt-4">
					<Button
						color="default"
						variant="flat"
						onPress={onClose}
						isDisabled={isLoading}
						className="flex-1"
					>
						{t("button_cancel", "Cancelar")}
					</Button>
					<Button
						color="primary"
						onPress={handleApplyFilters}
						isLoading={isLoading}
						className="flex-1"
					>
						{t("smart_tags_filter_apply", "Aplicar filtro")}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
