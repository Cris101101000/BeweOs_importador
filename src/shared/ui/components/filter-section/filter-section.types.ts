import type { ReactNode } from "react";

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
