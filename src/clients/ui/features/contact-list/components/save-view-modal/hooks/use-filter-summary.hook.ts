import type { DateValue, RangeValue } from "@beweco/aurora-ui";
import { PROSPECTIVE_CLIENT } from "@clients/domain/constants/prospective-client.constants";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import {
	DATE_FORMATS,
	formatDateObjectToDisplay,
} from "@shared/utils/date-formatter.utils";
import { useTranslate } from "@tolgee/react";
import { es } from "date-fns/locale";
import { useMemo } from "react";
import type { ClientsTableFilters } from "@clients/ui/_shared/components/clients-filter-drawer/clients-filter-drawer.types";
import type { FilterSummary } from "../save-view-modal.types";

/**
 * Hook para generar el resumen de filtros aplicados
 */
export const useFilterSummary = (
	filters: Partial<ClientsTableFilters>
): FilterSummary[] => {
	const { t } = useTranslate();

	return useMemo(() => {
		const summary: FilterSummary[] = [];

		// Filtro de búsqueda general
		if (filters.search && filters.search.trim().length > 0) {
			summary.push({
				filterName: t("clients_filter_search_title", "Búsqueda"),
				values: [filters.search.trim()],
			});
		}

		/**
		 * Helper function to capitalize the first letter of a date string
		 */
		const capitalizeDateString = (dateString: string): string => {
			return dateString.charAt(0).toUpperCase() + dateString.slice(1);
		};

		/**
		 * Helper function to format date values using project date utilities
		 * Expects dates in DD/MM/YYYY format
		 */
		const formatDateValue = (
			dateValue: DateValue | RangeValue<DateValue> | null
		): string => {
			if (!dateValue) return "";

			// Handle RangeValue (has start and end)
			if (
				typeof dateValue === "object" &&
				"start" in dateValue &&
				"end" in dateValue
			) {
				const startDateFormatted = formatDateObjectToDisplay(
					dateValue.start.toString(),
					DATE_FORMATS.display,
					es
				);
				const endDateFormatted = formatDateObjectToDisplay(
					dateValue.end.toString(),
					DATE_FORMATS.display,
					es
				);
				const startDate = capitalizeDateString(startDateFormatted);
				const endDate = capitalizeDateString(endDateFormatted);
				return `${startDate} - ${endDate}`;
			}

			// Handle single DateValue
			const formatted = formatDateObjectToDisplay(
				dateValue.toString(),
				DATE_FORMATS.display,
				es
			);
			return capitalizeDateString(formatted);
		};

		// Filtros de fechas
		const dateFilters: string[] = [];
		const dates = (filters.dates ?? {}) as NonNullable<
			Partial<ClientsTableFilters["dates"]>
		>;

		if (dates.lastCommunication) {
			const dateLabel = t(
				"clients_filter_last_communication",
				"Fecha Últ. comunicación"
			);
			const formattedDate = formatDateValue(dates.lastCommunication);
			dateFilters.push(`${dateLabel}: ${formattedDate}`);
		}
		if (dates.birthdate) {
			const dateLabel = t("clients_filter_birthdate", "Fecha cumpleaños");
			const formattedDate = formatDateValue(dates.birthdate);
			dateFilters.push(`${dateLabel}: ${formattedDate}`);
		}
		if (dates.registered) {
			const dateLabel = t("clients_filter_registered", "Fecha registro");
			const formattedDate = formatDateValue(dates.registered);
			dateFilters.push(`${dateLabel}: ${formattedDate}`);
		}

		if (dateFilters.length > 0) {
			summary.push({
				filterName: t("clients_filter_dates_title", "Fecha"),
				values: dateFilters,
			});
		}

		// Filtros de estado
		const selectedStatuses = filters.status?.selectedStatuses;
		if (
			selectedStatuses &&
			Array.isArray(selectedStatuses) &&
			selectedStatuses.length > 0
		) {
			const statusValues = selectedStatuses.map((status) => {
				const config = STATUS_CLIENT[status];
				return config ? t(config.translationKey, status) : status;
			});

			summary.push({
				filterName: t("clients_filter_status_title", "Estado"),
				values: statusValues,
			});
		}

		// Filtros de potencial
		const selectedPotentials = filters.potential?.selectedPotentials;
		if (
			selectedPotentials &&
			Array.isArray(selectedPotentials) &&
			selectedPotentials.length > 0
		) {
			const potentialValues = selectedPotentials.map((potential) => {
				const config = PROSPECTIVE_CLIENT[potential];
				return config ? t(config.translationKey, potential) : potential;
			});

			summary.push({
				filterName: t("clients_filter_potential_title", "Potencial"),
				values: potentialValues,
			});
		}

		// Filtros de etiquetas de IA
		const selectedTags = filters.aiTags?.selectedTags;
		if (
			selectedTags &&
			Array.isArray(selectedTags) &&
			selectedTags.length > 0
		) {
			const tagValues = selectedTags.map(
				(tag) => tag.value || tag.id || "Etiqueta sin nombre"
			);

			summary.push({
				filterName: t("clients_filter_tags_title", "Etiquetas de IA"),
				values: tagValues,
			});
		}

		return summary;
	}, [filters, t]);
};
