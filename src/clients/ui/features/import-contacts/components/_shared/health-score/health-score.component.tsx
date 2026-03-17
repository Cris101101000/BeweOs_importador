import { useMemo } from "react";
import { Card, CardBody, IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";

interface HealthScoreProps {
	validCount: number;
	duplicateCount: number;
	invalidCount: number;
}

interface ScoreCard {
	labelKey: string;
	count: number;
	percentage: number;
	color: string;
	bgColor: string;
	darkBgColor: string;
	icon: string;
	iconColor: string;
}

/**
 * HealthScore
 *
 * Muestra 3 tarjetas con el resumen de validación:
 * válidos (verde), duplicados (amarillo), inválidos (rojo).
 */
export const HealthScore = ({
	validCount,
	duplicateCount,
	invalidCount,
}: HealthScoreProps) => {
	const { t } = useTranslate();

	const total = validCount + duplicateCount + invalidCount;

	const cards: ScoreCard[] = useMemo(() => {
		const calcPercentage = (count: number) =>
			total > 0 ? Math.round((count / total) * 100) : 0;

		return [
			{
				labelKey: "import_confirm_valid_count",
				count: validCount,
				percentage: calcPercentage(validCount),
				color: "text-success",
				bgColor: "bg-success-50",
				darkBgColor: "dark:bg-success-50/10",
				icon: "solar:check-circle-outline",
				iconColor: "text-success",
			},
			{
				labelKey: "import_confirm_duplicate_count",
				count: duplicateCount,
				percentage: calcPercentage(duplicateCount),
				color: "text-warning",
				bgColor: "bg-warning-50",
				darkBgColor: "dark:bg-warning-50/10",
				icon: "solar:copy-outline",
				iconColor: "text-warning",
			},
			{
				labelKey: "import_confirm_invalid_count",
				count: invalidCount,
				percentage: calcPercentage(invalidCount),
				color: "text-danger",
				bgColor: "bg-danger-50",
				darkBgColor: "dark:bg-danger-50/10",
				icon: "solar:close-circle-outline",
				iconColor: "text-danger",
			},
		];
	}, [validCount, duplicateCount, invalidCount, total]);

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
			{cards.map((card) => (
				<Card
					key={card.labelKey}
					shadow="sm"
					className={`${card.bgColor} ${card.darkBgColor} border-none`}
				>
					<CardBody className="flex flex-row items-center gap-4 p-4">
						<div
							className={`flex h-12 w-12 items-center justify-center rounded-full ${card.bgColor} ${card.darkBgColor}`}
						>
							<IconComponent
								icon={card.icon}
								className={card.iconColor}
								size="lg"
							/>
						</div>
						<div className="flex flex-col">
							<span className="text-sm text-default-500 dark:text-default-400">
								{t(card.labelKey)}
							</span>
							<div className="flex items-baseline gap-2">
								<span
									className={`text-2xl font-bold ${card.color}`}
								>
									{card.count}
								</span>
								<span className="text-sm text-default-400">
									({card.percentage}%)
								</span>
							</div>
						</div>
					</CardBody>
				</Card>
			))}
		</div>
	);
};
