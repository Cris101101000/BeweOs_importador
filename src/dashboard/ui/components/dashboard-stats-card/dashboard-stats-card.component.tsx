import { Card, CardBody } from "@heroui/react";
import { IconComponent, P, Tooltip } from "@beweco/aurora-ui";
import type { FC } from "react";

export interface DashboardStatsCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
	className?: string;
	noBackground?: boolean;
	tooltip?: string;
}

const colorClasses = {
	blue: {
		iconBg: 'bg-blue-100',
		iconColor: 'text-blue-600',
		bg: 'bg-blue-50',
		badgeBg: 'bg-blue-100',
		badgeText: 'text-blue-700'
	},
	green: {
		iconBg: 'bg-green-100',
		iconColor: 'text-green-600',
		bg: 'bg-green-50',
		badgeBg: 'bg-green-100',
		badgeText: 'text-green-700'
	},
	yellow: {
		iconBg: 'bg-yellow-100',
		iconColor: 'text-yellow-600',
		bg: 'bg-yellow-50',
		badgeBg: 'bg-yellow-100',
		badgeText: 'text-yellow-700'
	},
	red: {
		iconBg: 'bg-red-100',
		iconColor: 'text-red-600',
		bg: 'bg-red-50',
		badgeBg: 'bg-red-100',
		badgeText: 'text-red-700'
	},
	purple: {
		iconBg: 'bg-purple-100',
		iconColor: 'text-purple-600',
		bg: 'bg-purple-50',
		badgeBg: 'bg-purple-100',
		badgeText: 'text-purple-700'
	},
};

export const DashboardStatsCard: FC<DashboardStatsCardProps> = ({
	title,
	value,
	description,
	icon = 'solar:chart-2-bold',
	trend,
	color = 'blue',
	className = '',
	noBackground = true,
	tooltip,
}) => {
	const colorConfig = colorClasses[color];

	return (
		<Card 
			className={`${noBackground ? '' : colorConfig.bg} ${className}`}
			shadow="sm"
		>
			<CardBody className="p-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-1.5 mb-2">
							<P className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">{title}</P>
						{tooltip && (
							<Tooltip content={tooltip} placement="right" className="max-w-xs">
								<div className="cursor-help flex-shrink-0">
									<IconComponent 
										icon="solar:info-circle-linear" 
										className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" 
									/>
								</div>
							</Tooltip>
						)}
						</div>
						<div className="flex items-baseline gap-2 flex-wrap">
							<p className="text-2xl font-bold text-gray-900">
								{value}
							</p>
							{trend && (
								<span
									className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
										trend.isPositive
											? 'bg-green-100 text-green-700'
											: 'bg-red-100 text-red-700'
									}`}
								>
									<IconComponent
										icon={trend.isPositive ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'} 
										className="w-3 h-3 mr-0.5" 
									/>
									{Math.abs(trend.value)}%
								</span>
							)}
						</div>
					{description && (
						<P className="text-xs text-gray-400 mt-2 font-normal">{description}</P>
					)}
					</div>
				<div className={`flex-shrink-0 w-12 h-12 rounded-lg ${colorConfig.iconBg} flex items-center justify-center`}>
					<IconComponent icon={icon} className={`w-6 h-6 ${colorConfig.iconColor}`} />
				</div>
				</div>
			</CardBody>
		</Card>
	);
};
