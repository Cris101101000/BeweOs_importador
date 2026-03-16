import { type FC, type ReactNode, type MouseEvent, useMemo, useState } from "react";
import { T, useTranslate } from "@tolgee/react";
import { Card, H2, P } from "@beweco/aurora-ui";
import type { OperationalSummaryData } from "../../../domain/interfaces/dashboard.interface";

export interface OperationalSummaryProps {
	data: OperationalSummaryData;
	className?: string;
	children?: ReactNode;
	user?: { firstname: string } | null;
}

/** Fallback de porcentaje de configuración cuando la API no devuelve configurationPercentage */
function calculateConfigurationScore(data: OperationalSummaryData): number {
	let configuredItems = 0;
	const totalItems = 6;
	if (data.totalAITags > 0) configuredItems++;
	if (data.totalCampaigns > 0) configuredItems++;
	if (data.totalNotifications > 0) configuredItems++;
	if (data.totalSocialPosts > 0) configuredItems++;
	if (data.topProducts.length > 0) configuredItems++;
	if (data.activeClients > 0) configuredItems++;
	const baseScore = (configuredItems / totalItems) * 70;
	const tagsBonus =
		data.totalAITags > 0
			? ((data.totalAITags - data.unusedTags) / data.totalAITags) * 15
			: 0;
	const campaignBonus = Math.min(data.totalCampaigns * 2.5, 15);
	return Math.min(Math.round(baseScore + tagsBonus + campaignBonus), 100);
}

interface UsageChartProps {
	percentage: number;
	label: string;
	size?: number;
	color?: 'blue' | 'purple';
	showValue?: boolean;
}

const UsageChart: FC<UsageChartProps> = ({
	percentage,
	label,
	size = 100,
	color = 'blue',
	showValue = true,
}) => {
	const strokeWidth = 6;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percentage / 100) * circumference;
	
	const strokeColor =
		color === "blue" ? "#3b82f6" : "#8b5cf6";

	return (
		<div className="flex flex-col items-center">
			<div className="relative" style={{ width: size, height: size }}>
				<svg width={size} height={size} className="transform -rotate-90">
					{/* Círculo de fondo */}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="#f3f4f6"
						strokeWidth={strokeWidth}
					/>
					{/* Círculo de progreso */}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke={strokeColor}
						strokeWidth={strokeWidth}
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						className="transition-all duration-1000 ease-out"
					/>
				</svg>
				{/* Contenido central */}
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					{showValue && (
						<span className="text-xl font-bold text-gray-800">{percentage}%</span>
					)}
				</div>
			</div>
			{/* Label */}
			<span className="mt-2 text-xs text-gray-600 text-center font-medium">{label}</span>
		</div>
	);
};

export const OperationalSummary: FC<OperationalSummaryProps> = ({
	data,
	className = '',
	children,
	user,
}) => {
	const { t } = useTranslate();
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	
	const configScore = calculateConfigurationScore(data);
	const displayConfigScore =
		data.configurationPercentage ?? configScore;
	const showConfigChart = displayConfigScore < 100;

	const strongTag = useMemo(
		() => (content: ReactNode) => <strong>{content}</strong>,
		[]
	);

	const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};
	console.log("data summary => ", data);

	return (
		<div className={className}>
			{/* Card con reporte de Linda */}
			<Card 
				className="relative px-7 py-4.5 mb-5 border-gray-200 overflow-hidden"
				onMouseMove={handleMouseMove}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				{/* Gradiente esférico que sigue el cursor */}
				{isHovering && (
					<div
						className="absolute inset-0 pointer-events-none transition-opacity duration-300"
						style={{
							background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.08), transparent 80%)`,
						}}
					/>
				)}
				
				<div className="flex flex-col lg:flex-row items-center gap-4 relative z-10">
					{/* Texto del reporte */}
					<div className="flex-1">
						{/* Saludo */}
						<H2 className="text-lg font-bold text-gray-900 mb-2">
							{t('dashboard_greeting', 'Hola')}, {user?.firstname || 'Armando'} 👋
						</H2>
						
						{/* Métricas en formato párrafo: una locale por segmento con {placeholders} y <strong> vía T */}
						<P className="text-sm text-gray-700 leading-relaxed">
							<T
								keyName="dashboard_operational_summary_intro"
								params={{ strong: strongTag }}
							/>
							{data.totalCampaigns > 0 && (
								<>
									{" "}
									<T
										keyName="dashboard_operational_summary_campaigns"
										params={{
											strong: strongTag,
											campaignsTotal: data.totalCampaigns,
										}}
									/>
								</>
							)}
							{data.followerGrowth > 0 && (
								<>
									{" "}
									<T
										keyName="dashboard_operational_summary_contacts_growing"
										params={{
											strong: strongTag,
											pct: data.followerGrowth,
										}}
									/>
								</>
							)}
							{data.totalConversations > 0 && (
								<>
									{" "}
									<T
										keyName="dashboard_operational_summary_conversations"
										params={{
											strong: strongTag,
											conversationsTotal: data.totalConversations.toLocaleString(),
										}}
									/>
								</>
							)}
							{data.unusedTags > 0 && (
								<>
									{" "}
									<T
										keyName="dashboard_operational_summary_unused_tags"
										params={{
											strong: strongTag,
											unusedCount: data.unusedTags,
										}}
									/>
								</>
							)}
							{data.mostActiveNetwork?.trim() !== "" && (
								<>
									{" "}
									<T
										keyName="dashboard_operational_summary_network"
										params={{
											strong: strongTag,
											network: data.mostActiveNetwork,
										}}
									/>
								</>
							)}
							{" "}
							<T
								keyName="dashboard_operational_summary_growth"
								params={{ strong: strongTag }}
							/>
						</P>
					</div>

					{/* Gráficas pequeñas a la derecha */}
					{showConfigChart && (
						<div className="flex-shrink-0 flex gap-4">
							<UsageChart
								percentage={displayConfigScore}
								label={t("dashboard_configuration", "Configuración")}
								size={90}
								color="purple"
								showValue
							/>
						</div>
					)}
				</div>
			</Card>

			{/* Slot para tabs u otro contenido */}
			{children && <div className="mb-6">{children}</div>}
		</div>
	);
};