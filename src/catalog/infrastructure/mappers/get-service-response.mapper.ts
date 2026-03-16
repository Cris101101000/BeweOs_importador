import { EnumCatalogStatus } from "@catalog/domain/enums/catalog-status.enum";
import { EnumCatalogType } from "@catalog/domain/enums/catalog-type.enum";
import type { ICatalogItem } from "@catalog/domain/interfaces/catalog.interface";
import type { GetServiceResponseDto } from "../dtos/get-service.dto";
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
 * Maps GetServiceResponseDto to ICatalogItem domain object
 * Services always have type = EnumCatalogType.Service
 */
export const toServiceFromResponse = (
	responseDto: GetServiceResponseDto
): ICatalogItem => {
	const {
		id,
		name,
		description,
		basePrice,
		totalPrice,
		measureValue,
		measureUnit,
		category,
		isEnabled,
		createdAt,
		updatedAt,
	} = responseDto;

	// Format duration for display
	const formattedDuration = formatDurationFromApi(measureValue, measureUnit);

	return {
		id: id || "",
		name: name || "",
		...(description && { description }),
		price: totalPrice || basePrice || 0,
		currency: "COP", // Default currency for services
		categoryId: category || "",
		...(category && {
			category: {
				id: category, // Use category string as id
				name: formatCategoryName(category), // Format category name for display
				description: getCategoryDescription(category),
				color: getCategoryColor(category),
				type: EnumCatalogType.Service,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		}),
		status: isEnabled ? EnumCatalogStatus.Active : EnumCatalogStatus.Inactive,
		type: EnumCatalogType.Service, // Services always have this type
		interestCount: 0, // Default value for services
		...(measureValue && { duration: measureValue }), // Keep original duration in minutes for calculations
		metadata: {
			// Store formatted duration for display
			formattedDuration: formattedDuration,
			// Store original API values for reference
			measureValue: measureValue,
			measureUnit: measureUnit,
		},
		createdAt: createdAt ? new Date(createdAt) : new Date(),
		updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
	};
};
