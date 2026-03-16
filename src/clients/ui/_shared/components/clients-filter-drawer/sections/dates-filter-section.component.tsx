import { HolidayType } from "@settings/schedules/domain/interfaces/holiday.interface";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { DateFilterSection } from "../../date-filter-section/date-filter-section.component";
import type { DateFilterSectionValue } from "../../date-filter-section/date-filter-section.types";
import { FilterSection } from "../../filter-section/filter-section.component";
import type { DateFilters } from "../clients-filter-drawer.types";

interface DatesFilterSectionProps {
	isExpanded: boolean;
	activeFiltersCount: number;
	resetCounter: number;
	onToggleExpanded: () => void;
	onDateChange: (
		field: keyof DateFilters,
		value: DateFilterSectionValue
	) => void;

	/** Current date filters to show as initial values */
	currentDateFilters?: DateFilters;
}

/**
 * DatesFilterSection Component
 *
 * Sección de filtros por fechas (última comunicación, cumpleaños, registro)
 */
export const DatesFilterSection: FC<DatesFilterSectionProps> = ({
	isExpanded,
	activeFiltersCount,
	resetCounter,
	onToggleExpanded,
	onDateChange,
	currentDateFilters,
}) => {
	const { t } = useTranslate();

	return (
		<FilterSection
			title={t("clients_filter_dates_title", "Fecha")}
			isExpanded={isExpanded}
			onToggleExpanded={onToggleExpanded}
			activeFiltersCount={activeFiltersCount}
		>
			<div className="flex flex-col gap-4 mb-2">
				{/* Fecha de última comunicación */}
				<DateFilterSection
					key={`last-comm-${resetCounter}`}
					icon="solar:history-linear"
					translationKey="clients_filter_last_communication"
					defaultTitle="Fecha Últ. comunicación"
					initialType={
						currentDateFilters?.lastCommunication &&
						typeof currentDateFilters.lastCommunication === "object" &&
						"start" in currentDateFilters.lastCommunication
							? HolidayType.DateRange
							: HolidayType.SingleDay
					}
					initialDate={
						currentDateFilters?.lastCommunication &&
						typeof currentDateFilters.lastCommunication === "object" &&
						!("start" in currentDateFilters.lastCommunication)
							? currentDateFilters.lastCommunication
							: undefined
					}
					initialRange={
						currentDateFilters?.lastCommunication &&
						typeof currentDateFilters.lastCommunication === "object" &&
						"start" in currentDateFilters.lastCommunication
							? currentDateFilters.lastCommunication
							: undefined
					}
					onChange={(value: DateFilterSectionValue) => {
						onDateChange("lastCommunication", value);
					}}
				/>

				{/* Fecha de cumpleaños */}
				<DateFilterSection
					key={`birthdate-${resetCounter}`}
					icon="hugeicons:birthday-cake"
					translationKey="clients_filter_birthdate"
					defaultTitle="Fecha cumpleaños"
					initialType={
						currentDateFilters?.birthdate &&
						typeof currentDateFilters.birthdate === "object" &&
						"start" in currentDateFilters.birthdate
							? HolidayType.DateRange
							: HolidayType.SingleDay
					}
					initialDate={
						currentDateFilters?.birthdate &&
						typeof currentDateFilters.birthdate === "object" &&
						!("start" in currentDateFilters.birthdate)
							? currentDateFilters.birthdate
							: undefined
					}
					initialRange={
						currentDateFilters?.birthdate &&
						typeof currentDateFilters.birthdate === "object" &&
						"start" in currentDateFilters.birthdate
							? currentDateFilters.birthdate
							: undefined
					}
					onChange={(value: DateFilterSectionValue) => {
						onDateChange("birthdate", value);
					}}
				/>

				{/* Fecha de registro */}
				<DateFilterSection
					key={`registered-${resetCounter}`}
					icon="solar:calendar-outline"
					translationKey="clients_filter_registered"
					defaultTitle="Fecha registro"
					initialType={
						currentDateFilters?.registered &&
						typeof currentDateFilters.registered === "object" &&
						"start" in currentDateFilters.registered
							? HolidayType.DateRange
							: HolidayType.SingleDay
					}
					initialDate={
						currentDateFilters?.registered &&
						typeof currentDateFilters.registered === "object" &&
						!("start" in currentDateFilters.registered)
							? currentDateFilters.registered
							: undefined
					}
					initialRange={
						currentDateFilters?.registered &&
						typeof currentDateFilters.registered === "object" &&
						"start" in currentDateFilters.registered
							? currentDateFilters.registered
							: undefined
					}
					onChange={(value: DateFilterSectionValue) => {
						onDateChange("registered", value);
					}}
				/>
			</div>
		</FilterSection>
	);
};
