import { useMemo } from "react";
import { useTranslate } from "@tolgee/react";
import { Card, H3 } from "@beweco/aurora-ui";
import { Progress } from "@heroui/react";
import type { FC } from "react";
import type { ICampaignStats } from "../../../domain/interfaces/dashboard.interface";
import { CollapsibleHeader, DashboardStatsCard, SectionNoDataOverlay } from "../";

/** Alias para compatibilidad; la data viene del hook como ICampaignStats */
export type CampaignPerformanceSectionData = ICampaignStats;

export interface CampaignPerformanceSectionProps {
	isExpanded: boolean;
	onToggle: () => void;
	data: ICampaignStats;
}

const defaultTrend = { value: 0, isPositive: true };

export const CampaignPerformanceSection: FC<
	CampaignPerformanceSectionProps
> = ({ isExpanded, onToggle, data }) => {
	const { t } = useTranslate();

	const totalCampaignsTrendValue = data.totalCampaignsTrend ?? defaultTrend;
	const interactionRateTrendValue = data.interactionRateTrend ?? defaultTrend;
	const campaignsSorted = useMemo(
		() => [...data.campaignRanking].sort((a, b) => b.openRate - a.openRate),
		[data.campaignRanking]
	);

	const totalCampaignsStr = String(data.totalCampaigns);
	const interactionRateStr = `${(data.interactionRate * 100).toFixed(1)}%`;

	const allStatsZero =
		data.totalCampaigns === 0 && data.interactionRate === 0;
	const rankingHasNoData =
		!data.campaignRanking?.length ||
		data.campaignRanking.every((c) => c.openRate === 0);
	const hasNoData = allStatsZero && rankingHasNoData;

	return (
		<div className="bg-white rounded-lg shadow-sm border mb-6">
			<CollapsibleHeader
				title={t("dashboard_campaign_performance", "Rendimiento de las Campañas")}
				isExpanded={isExpanded}
				onToggle={onToggle}
			/>

			{isExpanded && (
				<div className="px-4 pb-4 space-y-4 relative">
					{hasNoData && <SectionNoDataOverlay />}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DashboardStatsCard
							title={t("dashboard_total_campaigns", "Total Campañas")}
							value={totalCampaignsStr}
							icon="solar:send-square-linear"
							color="purple"
							trend={totalCampaignsTrendValue}
							noBackground
						/>
						<DashboardStatsCard
							title={t("dashboard_interaction_rate", "Tasa de Interacción")}
							value={interactionRateStr}
							icon="solar:heart-linear"
							color="yellow"
							trend={interactionRateTrendValue}
							noBackground
							tooltip={t(
								"dashboard_interaction_rate_tooltip",
								"Calculo esto a partir de los clics y las respuestas que recibió tu campaña"
							)}
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
						{/* TODO: show when implemented endpoints get data */}
						{/* <div className="lg:col-span-4 space-y-4">
							<DashboardStatsCard
								title={t("dashboard_conversion_rate", "Tasa de Conversión")}
								value={data.conversionRate}
								icon="solar:chart-2-linear"
								color="green"
								trend={{ value: 12.6, isPositive: true }}
								noBackground
								tooltip={t(
									"dashboard_conversion_rate_tooltip",
									"Mido cuántos de tus contactos realizaron una acción concreta después de la campaña, como comprar o registrarse"
								)}
							/>
							<DashboardStatsCard
								title={t(
									"dashboard_customer_acquisition_cost",
									"Coste de Adquisición por Cliente"
								)}
								value={`$${data.customerAcquisitionCost.toFixed(2)}`}
								icon="solar:dollar-linear"
								color="red"
								className="!bg-white"
							/>
							<DashboardStatsCard
								title={t(
									"dashboard_return_on_investment",
									"Retorno de la Inversión"
								)}
								value={`${data.returnOnInvestment}%`}
								icon="solar:graph-up-linear"
								color="green"
								trend={{ value: 45.2, isPositive: true }}
								className="!bg-white"
								tooltip={t(
									"dashboard_return_on_investment_tooltip",
									"Calculo cuánto estás ganando por cada peso que inviertes en tus campañas y estrategias de marketing"
								)}
							/>
						</div> */}

						{/* <div className="lg:col-span-8"> TODO: show when implemented cards top */}
						<div className="lg:col-span-12">
							<Card className="p-6 h-full">
								<H3 className="text-base font-semibold text-gray-900 mb-4">
									{t(
										"dashboard_campaign_open_rates",
										"Tasa de Apertura por Campaña"
									)}
								</H3>
								<div className="space-y-3">
									{campaignsSorted.map((campaign, index) => (
										<div key={index} className="space-y-1">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<span className="text-xs text-gray-400 w-4 text-right">
														{index + 1}.
													</span>
													<span className="text-sm text-gray-700">
														{campaign.name}
													</span>
												</div>
												<span className="text-xs font-semibold text-gray-900">
													{campaign.openRate}%
												</span>
											</div>
											<Progress
												value={campaign.openRate}
												color="default"
												className="max-w-full"
												size="md"
												classNames={{
													indicator: "bg-purple-200",
												}}
											/>
										</div>
									))}
								</div>
							</Card>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

