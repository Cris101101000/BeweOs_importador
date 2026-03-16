import { useTranslate } from "@tolgee/react";
import { useEffect, useState } from "react";
import { GetCatalogEnumsUseCase } from "../../application/get-catalog-enums.usecase";
import type { EnumCatalogType } from "../../domain/enums/catalog-type.enum";
import type { ICatalogCategory } from "../../domain/interfaces/catalog-category.interface";
import { CatalogEnumsAdapter } from "../../infrastructure/adapters/catalog-enums.adapter";
import { mapApiCategoriesToCatalogCategories } from "../../infrastructure/mappers/category-enums.mapper";
import {
	// catalogBrandsMock,
	catalogCategoriesMock,
} from "../../infrastructure/mocks/catalog-response.mock";

interface UseCatalogFiltersDataProps {
	type: EnumCatalogType;
}

interface CatalogFiltersData {
	categories: ICatalogCategory[];
	brands: Array<{ id: string; name: string }>;
	isLoading: boolean;
	error: string | null;
}

export const useCatalogFiltersData = ({
	type,
}: UseCatalogFiltersDataProps): CatalogFiltersData => {
	const { t } = useTranslate();
	const [categories, setCategories] = useState<ICatalogCategory[]>([]);
	// const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadFiltersData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Initialize adapter and use case
				const catalogEnumsAdapter = new CatalogEnumsAdapter();
				const getCatalogEnumsUseCase = new GetCatalogEnumsUseCase(
					catalogEnumsAdapter
				);

				// Get categories and other enum data
				const enumsData = await getCatalogEnumsUseCase.execute();

				// Use the mapper to convert API categories to ICatalogCategory with translations
				const categoriesData = mapApiCategoriesToCatalogCategories(
					enumsData.categories,
					type,
					t
				);

				setCategories(categoriesData);

				// TODO: Remove this once we have the brands from the API
				// // Use the same brands as in the create product modal
				// const brandsData = catalogBrandsMock.map((brand) => ({
				// 	id: brand.id,
				// 	name: brand.name,
				// }));
				// setBrands(brandsData);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error cargando datos de filtros"
				);

				// Fallback to mock data if API fails
				const fallbackCategories = catalogCategoriesMock.filter(
					(cat) => cat.type === type
				);
				setCategories(fallbackCategories);

				// TODO: Remove this once we have the brands from the API
				// // Use the same brands as in the create product modal
				// const brandsData = catalogBrandsMock.map((brand) => ({
				// 	id: brand.id,
				// 	name: brand.name,
				// }));
				// setBrands(brandsData);
			} finally {
				setIsLoading(false);
			}
		};

		loadFiltersData();
	}, [type]);

	return {
		categories,
		brands: [],
		isLoading,
		error,
	};
};
