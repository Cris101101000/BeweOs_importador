import type { DateValue, RangeValue } from "@beweco/aurora-ui";
import type { SmartTagStatus } from "../enums/smart-tag-status.enum";
import type { SmartTagType } from "../enums/smart-tag-type.enum";

/**
 * Filtros de estado de la etiqueta
 */
export interface StatusFilters {
	selectedStatuses: SmartTagStatus[];
}

/**
 * Filtros de tipo de etiqueta
 */
export interface TypeFilters {
	selectedTypes: SmartTagType[];
}

/**
 * Filtros de origen de la etiqueta
 */
export interface OriginFilters {
	selectedOrigins: ("ai" | "manual")[];
}

/**
 * Filtros de rango de usos
 */
export interface UsageRangeFilters {
	min?: number;
	max?: number;
}

/**
 * Filtros de rango de fechas
 */
export interface DateRangeFilters {
	created?: DateValue | RangeValue<DateValue> | null;
}
