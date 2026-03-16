import type { DrawerFiltersProps } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { useMemo } from "react";
import { EnumCatalogType } from "../../domain/enums/catalog-type.enum";
import type { ICatalogCategory } from "../../domain/interfaces/catalog-category.interface";

interface UseCatalogFiltersConfigProps {
	type: EnumCatalogType;
	categories?: ICatalogCategory[];
	brands?: Array<{ id: string; name: string }>;
}

export const useCatalogFiltersConfig = ({
	type,
	categories = [],
	brands = [],
}: UseCatalogFiltersConfigProps) => {
	const { t } = useTranslate();

	const filtersConfig = useMemo((): DrawerFiltersProps["config"] => {
		const baseConfig = {
			title: t("catalog_filters_title", "Filtrar Tabla"),
			description: t(
				"catalog_filters_description",
				`Selecciona las opciones para encontrar y visualizar tus ${type === EnumCatalogType.Product ? "productos" : "servicios"}.`
			),
			data: [
				{
					key: "isEnabled",
					title: t("catalog_filter_status_title", "Estado"),
					type: "select" as const,
					data: [
						{
							label: t("catalog_status_active", "Activo"),
							value: "active",
						},
						{
							label: t("catalog_status_inactive", "Inactivo"),
							value: "inactive",
						},
					],
				},
				// {
				// 	key: "fecha",
				// 	title: t("catalog_filter_date_title", "Fecha"),
				// 	type: "date" as const,
				// 	data: {
				// 		min: "2020-01-01",
				// 		max: "2025-12-31",
				// 		placeholder: t("catalog_filter_date_placeholder", "Seleccionar fecha"),
				// 	},
				// },
				{
					key: "categories",
					title: t("catalog_filter_category_title", "Categoría"),
					type: "multiselect" as const,
					data: categories.map((category: ICatalogCategory) => ({
						label: category.name,
						value: category.id,
					})),
				},
				{
					key: "price",
					title: t("catalog_filter_price_title", "Precio"),
					description: t(
						"catalog_filter_price_description",
						"Filtra por rango de precio"
					),
					type: "range" as const,
					data: {
						min: 0,
						max: 100000,
						step: 1000,
						unit: "$",
						showHistogramCount: false,
					},
				},
			],
		};

		// Add brand filter only for products
		if (type === EnumCatalogType.Product && brands.length > 0) {
			baseConfig.data.push({
				key: "brand",
				title: t("catalog_filter_brand_title", "Marca"),
				type: "multiselect" as const,
				data: brands.map((brand) => ({
					label: brand.name,
					value: brand.id,
				})),
			});
		}

		// Add duration filter only for services
		if (type === EnumCatalogType.Service) {
			baseConfig.data.push({
				key: "duration",
				title: t("catalog_filter_duration_title", "Duración"),
				description: t(
					"catalog_filter_duration_description",
					"Filtra por duración del servicio"
				),
				type: "range" as const,
				data: {
					min: 0,
					max: 480, // 8 hours in minutes
					step: 15,
					unit: t("catalog_filter_duration_unit", "min"),
				},
			});
		}

		return baseConfig;
	}, [type, categories, brands, t]);

	return {
		filtersConfig,
	};
};
