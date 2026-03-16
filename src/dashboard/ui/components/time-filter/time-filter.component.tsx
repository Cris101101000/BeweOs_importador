import { Select, SelectItem } from "@beweco/aurora-ui";
import type { FC } from "react";
import { useTranslate } from "@tolgee/react";

export interface TimeFilterOption {
	key: string;
	label: string;
	value: number; // meses
}

export interface TimeFilterProps {
	selectedPeriod: string;
	onPeriodChange: (period: string) => void;
	className?: string;
}

export const TimeFilter: FC<TimeFilterProps> = ({
	selectedPeriod,
	onPeriodChange,
	className = '',
}) => {
	const { t } = useTranslate();

	const timeOptions: TimeFilterOption[] = [
		{ key: '1', label: t('dashboard_filter_1_month', 'Último mes'), value: 1 },
		{ key: '3', label: t('dashboard_filter_3_months', 'Últimos 3 meses'), value: 3 },
		{ key: '6', label: t('dashboard_filter_6_months', 'Últimos 6 meses'), value: 6 },
		{ key: '12', label: t('dashboard_filter_12_months', 'Último año'), value: 12 },
	];

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<span className="text-sm font-medium text-gray-700">
				{t('dashboard_filter_period', 'Período:')}
			</span>
			<Select
				size="sm"
				selectedKeys={[selectedPeriod]}
				onSelectionChange={(keys) => {
					const selected = Array.from(keys)[0] as string;
					onPeriodChange(selected);
				}}
				className="w-40"
				variant="bordered"
			>
				{timeOptions.map((option) => (
					<SelectItem key={option.key} value={option.key}>
						{option.label}
					</SelectItem>
				))}
			</Select>
		</div>
	);
};
