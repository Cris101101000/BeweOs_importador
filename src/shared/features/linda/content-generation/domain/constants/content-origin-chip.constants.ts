import { ContentOrigin } from "../enums/content-origin.enum";

/** Colores de chip soportados (alineados con HeroUI Chip color prop) */
export type ContentOriginChipColor =
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger"
	| "default";

/** Alias para uso genérico de color de chip en UI */
export type ChipColor = ContentOriginChipColor;

/** Clases Tailwind para fondo del chip por origen (estilo glass: bg con transparencia) */
export type ContentOriginChipThemeClasses = string;

export interface ContentOriginChipConfig {
	color: ContentOriginChipColor;
	label: string;
	chipThemeClasses: ContentOriginChipThemeClasses;
	chipIcon: string;
	chipIconColorClass: string;
}

/** Diccionario de color y etiqueta del chip según el origen del contenido */
export const ORIGIN_CHIP_CONFIG: Record<
	ContentOrigin,
	ContentOriginChipConfig
> = {
	[ContentOrigin.AUTO_CONTENT_GENERATION]: {
		color: "secondary",
		label: "Generación automática",
		chipThemeClasses: "bg-purple-500/30",
		chipIcon: "solar:star-fall-minimalistic-2-bold",
		chipIconColorClass: "text-purple-500",
	},
	[ContentOrigin.MANUAL]: {
		color: "primary",
		label: "Manual",
		chipThemeClasses: "bg-blue-500/30",
		chipIcon: "solar:hand-shake-bold",
		chipIconColorClass: "text-blue-500",
	},
	[ContentOrigin.BANK_OF_IDEAS]: {
		color: "warning",
		label: "Banco de ideas",
		chipThemeClasses: "bg-yellow-500/30",
		chipIcon: "solar:lightbulb-minimalistic-bold",
		chipIconColorClass: "text-yellow-500",
	},
};
