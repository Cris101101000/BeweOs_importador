import type { DrawerFiltersProps } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { useMemo } from "react";

type UseSmartTagsFiltersConfigProps = {};

export const useSmartTagsFiltersConfig =
	({}: UseSmartTagsFiltersConfigProps = {}) => {
		const { t } = useTranslate();

		const filtersConfig = useMemo((): DrawerFiltersProps["config"] => {
			// Status options - multiselect
			const statusOptions = [
				{
					label: t("smart_tags_status_active", "Activa"),
					value: "ACTIVE",
				},
				{
					label: t("smart_tags_status_inactive", "Inactiva"),
					value: "INACTIVE",
				},
				{
					label: t("smart_tags_status_archived", "Deprecada"),
					value: "DEPRECATED",
				},
			];

			// Origin options - single select
			const originOptions = [
				{
					label: t("smart_tags_origin_ai", "Linda AI"),
					value: "AI_AUTO",
				},
				{
					label: t("smart_tags_origin_manual", "Manual"),
					value: "MANUAL",
				},
			];

			// Build filters array
			const baseFilters: DrawerFiltersProps["config"]["data"] = [
				{
					key: "status",
					title: t("smart_tags_filter_status_title", "Estado"),
					type: "multiselect" as const,
					data: statusOptions,
				},
				{
					key: "sourceType",
					title: t("smart_tags_filter_origin_title", "Origen"),
					type: "select" as const,
					data: originOptions,
				},
				{
					key: "usageCount",
					title: t("smart_tags_filter_usage_count_title", "Número de usos"),
					description: t(
						"smart_tags_filter_usage_count_description",
						"Filtra por rango de usos"
					),
					type: "range" as const,
					data: {
						min: 0,
						max: 100,
						step: 1,
						unit: "",
					},
				},
			];

			return {
				title: t("smart_tags_filter_modal_title", "Filtrar Etiquetas"),
				description: t(
					"smart_tags_filter_modal_description",
					"Selecciona las opciones para filtrar tus etiquetas inteligentes."
				),
				data: baseFilters,
			};
		}, [t]);

		return {
			filtersConfig,
		};
	};
