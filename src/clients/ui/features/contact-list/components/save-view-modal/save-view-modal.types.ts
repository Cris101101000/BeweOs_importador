import type { ClientsTableFilters } from "@clients/ui/_shared/components/clients-filter-drawer/clients-filter-drawer.types";

/**
 * Props para el componente SaveViewModal
 */
export interface SaveViewModalProps {
	/** Si el modal está abierto */
	isOpen: boolean;
	/** Función para cerrar el modal */
	onClose: () => void;
	/** Filtros aplicados actualmente */
	appliedFilters: Partial<ClientsTableFilters>;
	/** Si está cargando */
	isLoading?: boolean;
	/** Callback para refrescar las vistas después de crear una nueva */
	onViewCreated?: () => void;
}

/**
 * Resumen de un filtro aplicado
 */
export interface FilterSummary {
	/** Nombre del filtro */
	filterName: string;
	/** Valores aplicados */
	values: string[];
}

// Los tipos del estado ahora son manejados por react-hook-form
// Ver save-view-modal.schema.ts para el esquema de validación
