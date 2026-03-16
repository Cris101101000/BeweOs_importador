import { Input } from "@beweco/aurora-ui";
import { FilterSection } from "@shared/ui/components";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

interface UsageRangeFilterSectionProps {
	min?: number;
	max?: number;
	isExpanded: boolean;
	activeFiltersCount: number;
	onToggleExpanded: () => void;
	onRangeChange: (min?: number, max?: number) => void;
}

/**
 * UsageRangeFilterSection Component
 *
 * Sección de filtros por rango de usos
 */
export const UsageRangeFilterSection: FC<UsageRangeFilterSectionProps> = ({
	min,
	max,
	isExpanded,
	activeFiltersCount,
	onToggleExpanded,
	onRangeChange,
}) => {
	const { t } = useTranslate();

	return (
		<FilterSection
			title={t("smart_tags_filter_usage_title", "Número de usos")}
			isExpanded={isExpanded}
			onToggleExpanded={onToggleExpanded}
			activeFiltersCount={activeFiltersCount}
		>
			<div className="flex gap-3">
				<Input
					type="number"
					label={t("smart_tags_filter_usage_min", "Mínimo")}
					placeholder="0"
					value={min?.toString() || ""}
					onValueChange={(value) => {
						const numValue = value ? Number.parseInt(value) : undefined;
						onRangeChange(numValue, max);
					}}
					min={0}
				/>
				<Input
					type="number"
					label={t("smart_tags_filter_usage_max", "Máximo")}
					placeholder={t("smart_tags_filter_usage_unlimited", "Sin límite")}
					value={max?.toString() || ""}
					onValueChange={(value) => {
						const numValue = value ? Number.parseInt(value) : undefined;
						onRangeChange(min, numValue);
					}}
					min={0}
				/>
			</div>
		</FilterSection>
	);
};
