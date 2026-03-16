import { KnowledgeGapType } from "./enums";
import type { GapTypeConfig } from "./interfaces";

export const GAP_TYPE_CONFIG: Record<KnowledgeGapType, GapTypeConfig> = {
	[KnowledgeGapType.FAQ]: {
		label: "FAQ",
		color: "primary",
		icon: "solar:question-circle-bold",
		buttonLabel: "Ir a FAQ Sugerida",
		route: "/chatbot?section=faqs",
	},
	[KnowledgeGapType.BASIC_INFO]: {
		label: "Información Básica",
		color: "success",
		icon: "solar:buildings-2-bold",
		buttonLabel: "Ir a Información Básica",
		route: "/settings",
	},
	[KnowledgeGapType.PRODUCT]: {
		label: "Producto",
		color: "warning",
		icon: "solar:box-bold",
		buttonLabel: "Ir a Productos",
		route: "/catalog/products",
	},
	[KnowledgeGapType.SERVICE]: {
		label: "Servicio",
		color: "secondary",
		icon: "solar:widget-bold",
		buttonLabel: "Ir a Servicios",
		route: "/catalog/services",
	},
};

