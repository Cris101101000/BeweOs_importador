import type { DrawerFiltersProps } from "@beweco/aurora-ui";
import { PROSPECTIVE_CLIENT } from "@clients/domain/constants/prospective-client.constants";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import { useTranslate } from "@tolgee/react";
import { useMemo } from "react";

interface UseClientsFiltersConfigProps {
	availableTags?: IAiTag[];
}

export const useClientsFiltersConfig = ({
	availableTags = [],
}: UseClientsFiltersConfigProps) => {
	const { t } = useTranslate();

	const filtersConfig = useMemo((): DrawerFiltersProps["config"] => {
		// Convert status enum to multiselect options
		const statusOptions = Object.entries(STATUS_CLIENT).map(
			([key, config]) => ({
				label: t(config.translationKey, key),
				value: key,
			})
		);

		// Convert potential enum to multiselect options
		const potentialOptions = Object.entries(PROSPECTIVE_CLIENT).map(
			([key, config]) => ({
				label: t(config.translationKey, key),
				value: key,
			})
		);

		// Convert AI tags to multiselect options
		const tagOptions = availableTags
			.filter((tag) => tag.value)
			.map((tag) => ({
				label: tag.value,
				value: tag.id || tag.value,
			}));

		// Build base filters array
		const baseFilters: DrawerFiltersProps["config"]["data"] = [
			{
				key: "status",
				title: t("clients_filter_status_title", "Estado"),
				type: "multiselect" as const,
				data: statusOptions,
			},
			{
				key: "potential",
				title: t("clients_filter_potential_title", "Potencial"),
				type: "multiselect" as const,
				data: potentialOptions,
			},
			{
				key: "aiTags",
				title: t("clients_filter_tags_title", "Etiquetas de IA"),
				type: "multiselect" as const,
				data: tagOptions,
			},
			{
				key: "lastCommunication",
				title: t("clients_filter_last_communication", "Última Comunicación"),
				type: "date" as const,
				data: {
					min: "2020-01-01",
					max: new Date().toISOString().split("T")[0],
					placeholder: t(
						"clients_filter_date_placeholder",
						"Seleccionar fecha"
					),
				},
			},
			{
				key: "birthdate",
				title: t("clients_filter_birthdate", "Cumpleaños"),
				type: "date" as const,
				data: {
					min: "1950-01-01",
					max: new Date().toISOString().split("T")[0],
					placeholder: t(
						"clients_filter_date_placeholder",
						"Seleccionar fecha"
					),
				},
			},
			{
				key: "registered",
				title: t("clients_filter_registered", "Fecha de Registro"),
				type: "date" as const,
				data: {
					min: "2020-01-01",
					max: new Date().toISOString().split("T")[0],
					placeholder: t(
						"clients_filter_date_placeholder",
						"Seleccionar fecha"
					),
				},
			},
		];

		return {
			title: t("clients_filter_modal_title", "Filtrar Tabla"),
			description: t(
				"clients_filter_modal_description",
				"Selecciona las opciones para filtrar tu lista de clientes."
			),
			data: baseFilters,
		};
	}, [availableTags, t]);

	return {
		filtersConfig,
	};
};
