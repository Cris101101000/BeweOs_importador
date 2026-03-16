import type { DateValue, HolidayType, RangeValue } from "@beweco/aurora-ui";

/**
 * Props para el componente DateFilterSection
 */
export interface DateFilterSectionProps {
	/** Icono a mostrar junto al título */
	icon: string;
	/** Clave de traducción para el título */
	translationKey: string;
	/** Título por defecto si no hay traducción */
	defaultTitle: string;
	/** Función que se ejecuta cuando cambia la fecha */
	onChange?: (value: DateFilterSectionValue) => void;
	/** Tipo inicial del selector de fecha */
	initialType?: HolidayType;
	/** Valor inicial para fecha única */
	initialDate?: DateValue | null;
	/** Valor inicial para rango de fechas */
	initialRange?: RangeValue<DateValue> | null;
	/** Clase CSS adicional */
	className?: string;
}

export interface DateFilterSectionValue {
	type: HolidayType;
	date: DateValue | null;
	dateRange: RangeValue<DateValue> | null;
}
