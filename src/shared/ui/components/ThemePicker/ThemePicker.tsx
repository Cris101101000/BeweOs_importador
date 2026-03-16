/* Este componente es un wrapper del ThemePicker de aurora-ui para BeweOS */

import { ThemePicker as AuroraThemePicker } from "@beweco/aurora-ui";

export interface ThemePickerTranslations {
	lightTheme: string;
	darkTheme: string;
}

export interface ThemePickerProps {
	/** El tema actualmente seleccionado */
	value: "light" | "dark";
	/** Función llamada cuando se cambia el tema */
	onChange: (theme: "light" | "dark") => void;
	/** Clases CSS adicionales */
	className?: string;
	/** Traducciones personalizadas para los labels */
	translations?: ThemePickerTranslations;
}

/**
 * Selector de tema visual con preview interactivo basado en aurora-ui siguiendo las reglas de diseño BeweOS.
 *
 * Permite alternar entre tema claro y oscuro con una vista previa del diseño.
 * Incluye soporte completo para internacionalización con Tolgee.
 *
 * Reglas aplicadas:
 * - Preview visual interactivo de ambos temas
 * - Traducciones configurables (español por defecto)
 * - Transiciones suaves entre estados
 * - Accesibilidad completa
 * - Integración con sistema de i18n
 * - Soporte para contextos como paneles de configuración
 */
export const ThemePicker = ({
	value,
	onChange,
	className,
	translations,
}: ThemePickerProps) => {
	return (
		<AuroraThemePicker
			value={value}
			onChange={onChange}
			className={className}
			translations={translations}
		/>
	);
};

export default ThemePicker;
