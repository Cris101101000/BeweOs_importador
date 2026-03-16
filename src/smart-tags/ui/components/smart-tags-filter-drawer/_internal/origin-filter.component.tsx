import { Checkbox } from "@beweco/aurora-ui";
import { FilterSection } from "@shared/ui/components";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

interface OriginFilterSectionProps {
	selectedOrigins: ("ai" | "manual")[];
	isExpanded: boolean;
	activeFiltersCount: number;
	onToggleExpanded: () => void;
	onOriginToggle: (origin: "ai" | "manual") => void;
}

const ORIGIN_CONFIG = {
	ai: {
		label: "Linda AI",
		color: "bg-purple-50",
	},
	manual: {
		label: "Manual",
		color: "bg-blue-50",
	},
};

/**
 * OriginFilterSection Component
 *
 * Sección de filtros por origen de la etiqueta
 */
export const OriginFilterSection: FC<OriginFilterSectionProps> = ({
	selectedOrigins,
	isExpanded,
	activeFiltersCount,
	onToggleExpanded,
	onOriginToggle,
}) => {
	const { t } = useTranslate();

	return (
		<FilterSection
			title={t("smart_tags_filter_origin_title", "Origen")}
			isExpanded={isExpanded}
			onToggleExpanded={onToggleExpanded}
			activeFiltersCount={activeFiltersCount}
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{Object.entries(ORIGIN_CONFIG).map(([key, config]) => {
					const origin = key as "ai" | "manual";
					const isSelected = selectedOrigins.includes(origin);

					return (
						<div
							key={origin}
							className={`${
								config.color || "bg-default-50"
							} py-3 px-4 rounded-2xl flex items-center gap-2`}
						>
							<Checkbox
								isSelected={isSelected}
								onValueChange={() => onOriginToggle(origin)}
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
