import type { EnumCatalogType } from "../../domain/enums/catalog-type.enum";
import type { ICatalogCategory } from "../../domain/interfaces/catalog-category.interface";

/**
 * Maps API category strings to ICatalogCategory objects
 */
export const mapApiCategoriesToCatalogCategories = (
	apiCategories: string[],
	type: EnumCatalogType,
	t: (key: string, fallback?: string) => string
): ICatalogCategory[] => {
	return apiCategories.map((categoryName) => ({
		id: categoryName,
		name: t(`category_${categoryName}`, formatCategoryName(categoryName)),
		description: t(
			`category_description_${categoryName}`,
			getCategoryDescription(categoryName)
		),
		color: getCategoryColor(categoryName),
		type,
		createdAt: new Date(),
		updatedAt: new Date(),
	}));
};

/**
 * Formats category name from API format to display format
 */
export const formatCategoryName = (apiName: string): string => {
	return apiName
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

/**
 * Gets description for category based on API name
 */
export const getCategoryDescription = (apiName: string): string => {
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
export const getCategoryColor = (apiName: string): string => {
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
