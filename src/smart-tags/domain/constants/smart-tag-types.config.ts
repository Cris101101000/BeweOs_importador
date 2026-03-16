import { SmartTagType } from "../enums/smart-tag-type.enum.ts";

// Configuración de tipos de etiqueta con claves de traducción
export const SMART_TAG_TYPES_CONFIG = [
	{
		type: SmartTagType.INTEREST,
		label: "Interés del cliente",
		translationKey: "smart_tags_type_interest",
		color: "bg-pink-500",
		chipColor: "bg-pink-50 text-pink-700 border-pink-200",
	},
	{
		type: SmartTagType.CUSTOMER_TYPE,
		label: "Tipo de servicio",
		translationKey: "smart_tags_type_customer_type",
		color: "bg-teal-500",
		chipColor: "bg-teal-50 text-teal-700 border-teal-200",
	},
	{
		type: SmartTagType.BUYER_TYPE,
		label: "Tipo de comprador",
		translationKey: "smart_tags_type_buyer_type",
		color: "bg-blue-500",
		chipColor: "bg-blue-50 text-blue-700 border-blue-200",
	},
	{
		type: SmartTagType.PROBLEM,
		label: "Situación actual del cliente",
		translationKey: "smart_tags_type_problem",
		color: "bg-indigo-500",
		chipColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
	},
	{
		type: SmartTagType.FEELING,
		label: "Vínculo o relación personal",
		translationKey: "smart_tags_type_feeling",
		color: "bg-cyan-500",
		chipColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
	},
	{
		type: SmartTagType.NEED,
		label: "Motivación o necesidad",
		translationKey: "smart_tags_type_need",
		color: "bg-orange-500",
		chipColor: "bg-orange-50 text-orange-700 border-orange-200",
	},
	{
		type: SmartTagType.OBJECTIVE,
		label: "Valor para el negocio",
		translationKey: "smart_tags_type_objective",
		color: "bg-green-500",
		chipColor: "bg-green-50 text-green-700 border-green-200",
	},
	{
		type: SmartTagType.GOAL,
		label: "Meta",
		translationKey: "smart_tags_type_goal",
		color: "bg-emerald-500",
		chipColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
	{
		type: SmartTagType.ACTION,
		label: "Hábitos o comportamiento",
		translationKey: "smart_tags_type_action",
		color: "bg-red-500",
		chipColor: "bg-red-50 text-red-700 border-red-200",
	},
	{
		type: SmartTagType.SOLUTION,
		label: "Solución",
		translationKey: "smart_tags_type_solution",
		color: "bg-purple-500",
		chipColor: "bg-purple-50 text-purple-700 border-purple-200",
	},
	{
		type: SmartTagType.RESULT,
		label: "Resultado",
		translationKey: "smart_tags_type_result",
		color: "bg-yellow-500",
		chipColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
	},
] as const;
