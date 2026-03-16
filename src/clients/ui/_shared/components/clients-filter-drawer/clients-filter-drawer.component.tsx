import { DrawerFilters, type DrawerFiltersProps } from "@beweco/aurora-ui";
import { type FC, useCallback } from "react";
import { useFilters } from "@clients/ui/_shared/contexts/filters.context";
import { useClientsFiltersConfig } from "@clients/ui/features/contact-list/hooks/use-clients-filters-config.hook";
import { mapDrawerFiltersToClientsFilter } from "@clients/ui/_shared/mappers/drawer-filters-to-clients-filter.mapper";
import type { ClientsFilterDrawerProps } from "./clients-filter-drawer.types";

/**
 * ClientsFilterDrawer Component
 *
 * Drawer avanzado para filtrar la tabla de clientes que incluye:
 * - Filtros por fecha (última comunicación, cumpleaños, registro)
 * - Filtros por estado con colores del dominio
 * - Filtros por potencial con colores del dominio
 * - Filtros por etiquetas de IA con búsqueda
 * - Secciones colapsables con contadores de filtros activos
 * - UX mejorada con indicadores visuales y estados
 * - Optimizado para rendimiento con memoización
 *
 * @param props - Props del componente ClientsFilterDrawer
 */
export const ClientsFilterDrawer: FC<ClientsFilterDrawerProps> = ({
	isOpen,
	onClose,
	onApplyFilters,
	// currentFilters, // Not used - DrawerFilters manages its own state
	availableTags = [],
}) => {
	// Acceso al contexto de filtros para resetear completamente
	const { handleResetFilters: resetContextFilters } = useFilters();

	// Get filters config from hook
	const { filtersConfig } = useClientsFiltersConfig({ availableTags });

	// Handle apply filters from DrawerFilters
	const handleApplyFilters = useCallback(
		(drawerFilters: Record<string, any>) => {
			// Map DrawerFilters format to ClientsTableFilters
			const clientsFilters = mapDrawerFiltersToClientsFilter(
				drawerFilters,
				availableTags
			);

			console.log("clientsFilters", clientsFilters);
			onApplyFilters(clientsFilters);
			onClose();
		},
		[onApplyFilters, onClose, availableTags]
	);

	// Handle clear filters from DrawerFilters
	const handleClearFilters = useCallback(() => {
		// Reset filters in context
		resetContextFilters();
		onClose();
	}, [resetContextFilters, onClose]);

	// Handle drawer open/close changes
	const handleOpenChange = useCallback(
		(isOpen: boolean) => {
			if (!isOpen) {
				onClose();
			}
		},
		[onClose]
	);

	if (!filtersConfig) {
		return null;
	}

	return (
		<DrawerFilters
			config={filtersConfig as DrawerFiltersProps["config"]}
			onApplyFilters={handleApplyFilters}
			onClearFilters={handleClearFilters}
			onCancel={onClose}
			isOpen={isOpen}
			onOpenChange={handleOpenChange}
		/>
	);
};
