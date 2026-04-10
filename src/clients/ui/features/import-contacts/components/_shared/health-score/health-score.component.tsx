import { useMemo } from "react";
import { IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";

interface HealthScoreProps {
	validCount: number;
	duplicateCount: number;
	invalidCount: number;
}

/**
 * HealthScore
 *
 * Barra de progreso proporcional + 3 tarjetas neutras con métricas.
 * La barra concentra el color, las tarjetas son neutras con íconos de color.
 */
export const HealthScore = ({
	validCount,
	duplicateCount,
	invalidCount,
}: HealthScoreProps) => {
	const { t } = useTranslate();

	const total = validCount + duplicateCount + invalidCount;

	const percentages = useMemo(() => {
		if (total === 0) return { valid: 0, duplicate: 0, invalid: 0 };
		return {
			valid: Math.round((validCount / total) * 100),
			duplicate: Math.round((duplicateCount / total) * 100),
			invalid: Math.round((invalidCount / total) * 100),
		};
	}, [validCount, duplicateCount, invalidCount, total]);

	const cards = useMemo(() => [
		{
			labelKey: "import_confirm_valid_count",
			count: validCount,
			percentage: percentages.valid,
			icon: "solar:check-circle-outline",
			iconColor: "text-success",
		},
		{
			labelKey: "import_confirm_duplicate_count",
			count: duplicateCount,
			percentage: percentages.duplicate,
			icon: "solar:copy-outline",
			iconColor: "text-warning",
		},
		{
			labelKey: "import_confirm_invalid_count",
			count: invalidCount,
			percentage: percentages.invalid,
			icon: "solar:close-circle-outline",
			iconColor: "text-danger",
		},
	], [validCount, duplicateCount, invalidCount, percentages]);

	return (
		<div className="flex flex-col gap-4">
			{/* Barra de progreso proporcional */}
			<div className="flex h-2 w-full overflow-hidden rounded-full bg-default-100">
				{percentages.valid > 0 && (
					<div
						className="h-full bg-success transition-all"
						style={{ width: `${percentages.valid}%` }}
					/>
				)}
				{percentages.duplicate > 0 && (
					<div
						className="h-full bg-warning transition-all"
						style={{ width: `${percentages.duplicate}%` }}
					/>
				)}
				{percentages.invalid > 0 && (
					<div
						className="h-full bg-danger transition-all"
						style={{ width: `${percentages.invalid}%` }}
					/>
				)}
			</div>

			{/* Tarjetas de métricas neutras */}
			<div className="grid grid-cols-3 gap-2 sm:gap-3">
				{cards.map((card) => (
					<div
						key={card.labelKey}
						className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-3 rounded-xl border border-default-200 dark:border-default-100 bg-default-50 dark:bg-default-100/30 px-2 py-3 sm:px-4"
					>
						<IconComponent
							icon={card.icon}
							className={card.iconColor}
							size="md"
						/>
						<div className="flex flex-col items-center sm:items-start">
							<span className="text-[10px] sm:text-xs text-default-400 text-center sm:text-left">
								{t(card.labelKey)}
							</span>
							<span className="text-lg sm:text-xl font-bold text-default-800 dark:text-default-500">
								{card.count.toLocaleString()}
							</span>
							<span className="text-[10px] sm:text-xs text-default-400">
								{card.percentage}%
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
