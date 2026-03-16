import { Checkbox } from "@beweco/aurora-ui";
import { FilterSection } from "@shared/ui/components";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { SmartTagStatus } from "../../../../domain/enums/smart-tag-status.enum";

interface StatusFilterSectionProps {
	selectedStatuses: SmartTagStatus[];
	isExpanded: boolean;
	activeFiltersCount: number;
	onToggleExpanded: () => void;
	onStatusToggle: (status: SmartTagStatus) => void;
}

const STATUS_CONFIG = {
	[SmartTagStatus.ACTIVE]: {
		label: "Activa",
		color: "bg-success-50",
	},
	[SmartTagStatus.DRAFT]: {
		label: "Deprecada",
		color: "bg-warning-50",
	},
	[SmartTagStatus.INACTIVE]: {
		label: "Inactiva",
		color: "bg-default-100",
	},
};

/**
 * StatusFilterSection Component
 *
 * Sección de filtros por estado de la etiqueta
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
			title={t("smart_tags_filter_status_title", "Estado")}
			isExpanded={isExpanded}
			onToggleExpanded={onToggleExpanded}
			activeFiltersCount={activeFiltersCount}
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{Object.entries(STATUS_CONFIG).map(([key, config]) => {
					const status = key as SmartTagStatus;
					const isSelected = selectedStatuses.includes(status);

					return (
						<div
							key={status}
							className={`${
								config.color || "bg-default-50"
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
								{config.label}
							</Checkbox>
						</div>
					);
				})}
			</div>
		</FilterSection>
	);
};
