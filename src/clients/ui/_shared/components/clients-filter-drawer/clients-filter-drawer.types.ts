import type { DateValue, RangeValue } from "@beweco/aurora-ui";
import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { EnumOrder } from "@clients/domain/enums/order.enum";
import type { EnumPotentialClient } from "@clients/domain/enums/potential.enum";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type { ReactNode } from "react";

/**
 * Filtros de fecha para comunicación y registro
 */
export interface DateFilters {
	/** Fecha de última comunicación */
	lastCommunication?: DateValue | RangeValue<DateValue> | null;
	/** Fecha de cumpleaños */
	birthdate?: DateValue | RangeValue<DateValue> | null;
	/** Fecha de registro */
	registered?: DateValue | RangeValue<DateValue> | null;
}

/**
 * Filtros de estado del cliente
 */
export interface StatusFilters {
	/** Estados seleccionados */
	selectedStatuses: EnumClientStatus[];
}

/**
 * Filtros de potencial del cliente
 */
export interface PotentialFilters {
	/** Niveles de potencial seleccionados */
	selectedPotentials: EnumPotentialClient[];
}

/**
 * Filtros de etiquetas de IA
 */
export interface AITagsFilters {
	/** Etiquetas seleccionadas */
	selectedTags: IAiTag[];
	/** Búsqueda de etiquetas */
	tagSearchQuery: string;
}

/**
 * Estructura completa de filtros para clientes
 */
export interface ClientsTableFilters {
	/** Filtros de fechas */
	dates: DateFilters;
	/** Filtros de estado */
	status: StatusFilters;
	/** Filtros de potencial */
	potential: PotentialFilters;
	/** Filtros de etiquetas de IA */
	aiTags: AITagsFilters;
	/** Término de búsqueda */
	search?: string;
	/** Ordenamiento */
	order?: EnumOrder;
}

/**
 * Props del componente ClientsFilterDrawer
 */
export interface ClientsFilterDrawerProps {
	/** Si el drawer está abierto */
	isOpen: boolean;
	/** Función para cerrar el drawer */
	onClose: () => void;
	/** Función que se ejecuta al aplicar filtros */
	onApplyFilters: (filters: ClientsTableFilters) => void;
	/** Filtros actuales aplicados */
	currentFilters?: Partial<ClientsTableFilters>;
	/** Lista de etiquetas disponibles para filtrar */
	availableTags?: IAiTag[];
	/** Si está cargando */
	isLoading?: boolean;
}

/**
 * Props para el componente de sección de filtros
 */
export interface FilterSectionProps {
	/** Título de la sección */
	title: string;
	/** Si la sección está expandida */
	isExpanded?: boolean;
	/** Función para cambiar el estado de expansión */
	onToggleExpanded?: () => void;
	/** Contenido de la sección */
	children: ReactNode;
	/** Número de filtros activos en esta sección */
	activeFiltersCount?: number;
}

/**
 * Estado interno del drawer de filtros de clientes
 */
export interface ClientsFilterDrawerState extends ClientsTableFilters {
	/** Si hay cambios pendientes */
	hasChanges: boolean;
	/** Secciones expandidas */
	expandedSections: {
		dates: boolean;
		status: boolean;
		potential: boolean;
		aiTags: boolean;
	};
}
