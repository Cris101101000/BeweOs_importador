import { Checkbox } from "@beweco/aurora-ui";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import { BACKGROUND_COLOR_MAP } from "@shared/utils/status-colors.utils";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { FilterSection } from "../../filter-section/filter-section.component";

interface StatusFilterSectionProps {
	selectedStatuses: EnumClientStatus[];
	isExpanded: boolean;
	activeFiltersCount: number;
	onToggleExpanded: () => void;
	onStatusToggle: (status: EnumClientStatus) => void;
}

/**
 * StatusFilterSection Component
 *
 * Sección de filtros por estado del cliente
 */
export const StatusFilterSection: FC<StatusFilterSectionProps> = ({
	selectedStatuses,
	isExpanded,
	activeFiltersCount,
	onToggleExpanded,
	onStatusToggle,
}) => {
	const { t } = useTranslate();

	return (
		<FilterSection
			title={t("clients_filter_status_title", "Estado")}
			isExpanded={isExpanded}
			onToggleExpanded={onToggleExpanded}
			activeFiltersCount={activeFiltersCount}
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{Object.entries(STATUS_CLIENT).map(([key, config]) => {
					const status = key as EnumClientStatus;
					const isSelected = selectedStatuses.includes(status);

					return (
						<div
							key={status}
							className={`${
								BACKGROUND_COLOR_MAP[config.color] || "bg-default-50"
							} py-3 px-4 rounded-2xl flex items-center gap-2`}
						>
							<Checkbox
								isSelected={isSelected}
								onValueChange={() => onStatusToggle(status)}
								size="sm"
								color="primary"
								classNames={{
									wrapper: "flex-shrink-0 bg-default-50",
									label:
										"text-tiny text-default-600 font-normal leading-tight w-full",
								}}
							>
								{t(config.translationKey, status)}
							</Checkbox>
						</div>
					);
				})}
			</div>
		</FilterSection>
	);
};
