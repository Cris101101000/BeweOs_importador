import { EnumCatalogStatus } from "@catalog/domain/enums/catalog-status.enum";
import { EnumCatalogType } from "@catalog/domain/enums/catalog-type.enum";
import type { ICatalogItem } from "@catalog/domain/interfaces/catalog.interface";
import type { GetCatalogItemResponseDto } from "../dtos/get-catalog-item.dto";
import { formatDurationFromApi } from "../utils/duration-formatter.util";

/**
 * Formats category name from API format to display format
 */
const formatCategoryName = (apiName: string): string => {
	return apiName
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

/**
 * Gets description for category based on API name
 */
const getCategoryDescription = (apiName: string): string => {
	const descriptions: Record<string, string> = {
		alimentos_bebidas: "Productos alimenticios y bebidas",
		belleza_estetica: "Productos de belleza y estética",
		tecnologia: "Productos tecnológicos y electrónicos",
		salud_medicina: "Productos de salud y medicina",
		educacion: "Productos educativos y de aprendizaje",
		entretenimiento: "Productos de entretenimiento",
		moda_textil: "Productos de moda y textil",
		hogar_decoracion: "Productos para hogar y decoración",
		automotriz: "Productos automotrices",
		servicios_profesionales: "Servicios profesionales",
		turismo_hospitalidad: "Servicios de turismo y hospitalidad",
		deportes_fitness: "Productos de deportes y fitness",
		mascotas: "Productos para mascotas",
		jardineria: "Productos de jardinería",
		otros: "Otras categorías",
	};

	return descriptions[apiName] || `Categoría ${formatCategoryName(apiName)}`;
};

/**
 * Gets color for category based on API name
 */
const getCategoryColor = (apiName: string): string => {
	const colors: Record<string, string> = {
		alimentos_bebidas: "#F59E0B", // Amber
		belleza_estetica: "#EC4899", // Pink
		tecnologia: "#3B82F6", // Blue
		salud_medicina: "#10B981", // Emerald
		educacion: "#8B5CF6", // Violet
		entretenimiento: "#F97316", // Orange
		moda_textil: "#EF4444", // Red
		hogar_decoracion: "#84CC16", // Lime
		automotriz: "#6B7280", // Gray
		servicios_profesionales: "#06B6D4", // Cyan
		turismo_hospitalidad: "#14B8A6", // Teal
		deportes_fitness: "#22C55E", // Green
		mascotas: "#A78BFA", // Purple
		jardineria: "#34D399", // Emerald
		otros: "#9CA3AF", // Gray
	};

	return colors[apiName] || "#6B7280";
};

/**
 * Maps API response DTO to domain ICatalogItem
 * Works for both products and services
 */
export function toCatalogItemFromResponse(
	item: GetCatalogItemResponseDto,
	type: EnumCatalogType
): ICatalogItem {
	const status = item.isEnabled
		? EnumCatalogStatus.Active
		: EnumCatalogStatus.Inactive;

	// Format duration for services
	let formattedDuration = undefined;

	if (type === EnumCatalogType.Service) {
		formattedDuration = formatDurationFromApi(
			item.measureValue,
			item.measureUnit
		);
	}

	// Create category object from the category string
	const categoryObject = item.category
		? {
				id: item.category,
				name: formatCategoryName(item.category),
				description: getCategoryDescription(item.category),
				color: getCategoryColor(item.category),
				type,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		: undefined;

	return {
		id: item.id,
		name: item.name,
		description: item.description,
		price: item.totalPrice,
		currency: "COP", // Default currency, could be made configurable
		categoryId: item.category,
		category: categoryObject,
		status,
		type,
		interestCount: 0, // Default value, could be added to API response
		images: [], // Default empty array, could be added to API response
		tags: [], // Default empty array, could be added to API response
		pdfUrl: undefined, // Could be added to API response
		pdfName: undefined, // Could be added to API response
		duration: item.duration, // Only relevant for services
		metadata: {
			// Store additional product/service specific data
			basePrice: item.basePrice,
			tax: item.tax,
			measureUnit: item.measureUnit,
			measureValue: item.measureValue,
			formattedMeasure: item.formattedMeasure,
			formattedDuration: formattedDuration, // Formatted duration for services
			brand: item.brand,
			parentId: item.parentId,
			sku: item.sku,
			isParent: item.isParent,
			isVariant: item.isVariant,
			companyId: item.companyId,
			excludeFromAI: item.isAiExcluded ?? false, // Map isAiExcluded from API to excludeFromAI in metadata
		},
		createdAt: new Date(item.createdAt),
		updatedAt: new Date(item.updatedAt),
		externalPurchaseUrl: item.externalPurchaseUrl,
		externalUrl: item.externalUrl,
	};
}

/**
 * Maps array of API response DTOs to array of domain ICatalogItems
 */
export function toCatalogItemsFromResponse(
	items: GetCatalogItemResponseDto[],
	type: EnumCatalogType
): ICatalogItem[] {
	return items.map((item) => toCatalogItemFromResponse(item, type));
}
