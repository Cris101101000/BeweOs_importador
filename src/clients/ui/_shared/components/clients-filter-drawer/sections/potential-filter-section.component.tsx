import { Checkbox } from "@beweco/aurora-ui";
import { PROSPECTIVE_CLIENT } from "@clients/domain/constants/prospective-client.constants";
import type { EnumPotentialClient } from "@clients/domain/enums/potential.enum";

import { BACKGROUND_COLOR_MAP } from "@shared/utils/status-colors.utils";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { FilterSection } from "../../filter-section/filter-section.component";

interface PotentialFilterSectionProps {
	selectedPotentials: EnumPotentialClient[];
	isExpanded: boolean;
	activeFiltersCount: number;
	onToggleExpanded: () => void;
	onPotentialToggle: (potential: EnumPotentialClient) => void;
}

/**
 * PotentialFilterSection Component
 *
 * Sección de filtros por potencial del cliente
 */
export const PotentialFilterSection: FC<PotentialFilterSectionProps> = ({
	selectedPotentials,
	isExpanded,
	activeFiltersCount,
	onToggleExpanded,
	onPotentialToggle,
}) => {
	const { t } = useTranslate();

	return (
		<FilterSection
			title={t("clients_filter_potential_title", "Potencial")}
			isExpanded={isExpanded}
			onToggleExpanded={onToggleExpanded}
			activeFiltersCount={activeFiltersCount}
		>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{Object.entries(PROSPECTIVE_CLIENT).map(([key, config]) => {
					const potential = key as EnumPotentialClient;
					const isSelected = selectedPotentials.includes(potential);

					return (
						<div
							key={potential}
							className={`${
								BACKGROUND_COLOR_MAP[config.color] || "bg-default-50"
							} py-3 px-4 rounded-2xl flex items-center gap-2`}
						>
							<Checkbox
								isSelected={isSelected}
								onValueChange={() => onPotentialToggle(potential)}
								size="sm"
								color="primary"
								classNames={{
									wrapper: "flex-shrink-0 bg-default-50",
									label:
										"text-tiny text-default-600 font-normal leading-tight w-full",
								}}
							>
								{t(config.translationKey, potential)}
							</Checkbox>
						</div>
					);
				})}
			</div>
		</FilterSection>
	);
};
