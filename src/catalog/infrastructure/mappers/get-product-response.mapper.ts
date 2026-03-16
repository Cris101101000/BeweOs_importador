import { EnumCatalogStatus } from "@catalog/domain/enums/catalog-status.enum";
import { EnumCatalogType } from "@catalog/domain/enums/catalog-type.enum";
import type { ICatalogItem } from "@catalog/domain/interfaces/catalog.interface";
import type { GetProductResponseDto } from "../dtos/get-product.dto";

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
 * Maps GetProductResponseDto to ICatalogItem domain object
 */
export const toProductFromResponse = (
	responseDto: GetProductResponseDto
): ICatalogItem => {
	const {
		id,
		name,
		description,
		basePrice,
		totalPrice,
		category,
		measureUnit,
		measureValue,
		isEnabled,
		createdAt,
		updatedAt,
	} = responseDto;

	// Create a basic category object from the category string
	const categoryObject = category
		? {
				id: category,
				name: formatCategoryName(category),
				description: getCategoryDescription(category),
				color: getCategoryColor(category),
				type: EnumCatalogType.Product,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		: undefined;

	return {
		id: id || "",
		name: name || "",
		description: description || "",
		// currency: currency || "USD",
		price: totalPrice || basePrice || 0,
		currency: "COP", // Default currency since API doesn't provide it
		categoryId: category || "",
		category: categoryObject,
		status: isEnabled ? EnumCatalogStatus.Active : EnumCatalogStatus.Inactive,
		type: EnumCatalogType.Product,
		interestCount: 0, // Default value since API doesn't provide it
		metadata: {
			measureUnit: measureUnit || "unidad",
			measureValue: measureValue || 1,
		},
		createdAt: createdAt ? new Date(createdAt) : new Date(),
		updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
	};
};
