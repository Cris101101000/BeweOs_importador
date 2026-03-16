import { AreaLineChart, Card, H3, P, Tabs, Tab } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { INotificationStats } from "../../../domain/interfaces/dashboard.interface";
import { CollapsibleHeader, DashboardStatsCard, SectionNoDataOverlay } from "../";
import { ChannelProgressBar } from "./channel-progress-bar.component";
import type { OpenTimeDistributionPeriod } from "../../hooks/use-open-time-distribution.hook";

export type ChannelKey = "whatsapp" | "email";

export interface NotificationsSectionProps {
	isExpanded: boolean;
	onToggle: () => void;
	data: INotificationStats | null;
	linearGraphData: Array<{ name: string; whatsapp: number; email: number }>;
	openTimePeriod: OpenTimeDistributionPeriod;
	onOpenTimePeriodChange: (period: OpenTimeDistributionPeriod) => void;
}

export interface ChannelSummary {
	highestChannel: ChannelKey;
	lowestChannel: ChannelKey;
	readRateHighest: number;
}

function getChannelComparison(data: INotificationStats): ChannelSummary {
	const whatsappRate = data.channel.whatsapp.readRate ?? 0;
	const emailRate = data.channel.email.readRate ?? 0;
	const whatsappIsHigher = whatsappRate >= emailRate;
	return {
		highestChannel: whatsappIsHigher ? "whatsapp" : "email",
		lowestChannel: whatsappIsHigher ? "email" : "whatsapp",
		readRateHighest: whatsappIsHigher ? whatsappRate : emailRate,
	};
}

export const NotificationsSection: FC<NotificationsSectionProps> = ({
	isExpanded,
	onToggle,
	data,
	linearGraphData,
	openTimePeriod,
	onOpenTimePeriodChange,
}) => {
	const { t } = useTranslate();
	const [channelSummary, setChannelSummary] = useState<ChannelSummary | null>(null);

	const totalNotifications = data?.sentCount ?? 0;
	const deliveryRate =
		data && data.sentCount > 0
			? Math.round((data.deliveredCount / data.sentCount) * 100)
			: 0;
	const readRate = data?.readRate ?? 0;
	const whatsappReadRate = data?.channel.whatsapp.readRate ?? 0;
	const emailReadRate = data?.channel.email.readRate ?? 0;

	const allStatsZero =
		totalNotifications === 0 &&
		deliveryRate === 0 &&
		readRate === 0 &&
		whatsappReadRate === 0 &&
		emailReadRate === 0;
	const graphHasNoData =
		linearGraphData.length === 0 ||
		linearGraphData.every((d) => d.whatsapp === 0 && d.email === 0);
	const hasNoData = data !== null && allStatsZero && graphHasNoData;

	useEffect(() => {
		if (data) {
			setChannelSummary(getChannelComparison(data));
		}
	}, [data]);

	return (
		<div className="bg-white rounded-lg shadow-sm border mb-6">
			<CollapsibleHeader
				title={t("dashboard_notifications_title")}
				isExpanded={isExpanded}
				onToggle={onToggle}
			/>

			{isExpanded && (
				<div className="px-4 pb-4 space-y-6 relative">
					{hasNoData && <SectionNoDataOverlay />}
					<div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] gap-6 lg:items-stretch">
						<div className="lg:col-span-12 lg:row-start-1">
							<Card className="p-6 h-full">
								<H3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
									{t("dashboard_notifications_channel_performance")}
								</H3>
								<P className="text-sm text-gray-600 mb-4">
									<span className="font-medium text-gray-900">
										{t("dashboard_notifications_channel_description", {
											highestChannel: channelSummary?.highestChannel,
											lowestChannel: channelSummary?.lowestChannel,
											readRateHighestChannel: channelSummary?.readRateHighest,
										})}
									</span>{" "}
									{/* TODO: show when implemented update plan button */}
									{/* <button
										type="button"
										className="gradient-animated-text font-medium text-blue-600"
									>
										{t("dashboard_notifications_improve_plan")}
									</button> */}
								</P>
								<div className="space-y-4">
									<ChannelProgressBar
										label={t("dashboard_notifications_channel_whatsapp")}
										value={whatsappReadRate}
										trackColor="bg-green-100"
										fillColor="bg-green-500"
									/>
									<ChannelProgressBar
										label={t("dashboard_notifications_channel_email")}
										value={emailReadRate}
										trackColor="bg-blue-100"
										fillColor="bg-blue-500"
									/>
								</div>
							</Card>
						</div>
						<div className="lg:col-span-4 lg:row-start-2 flex flex-col h-full space-y-4">
							<DashboardStatsCard
								title={t("dashboard_notifications_total")}
								value={totalNotifications.toLocaleString()}
								description={t("dashboard_notifications_sent_this_period")}
								icon="solar:bell-bing-linear"
								color="blue"
								className="flex-1"
							/>
							<DashboardStatsCard
								title={t("dashboard_notifications_delivery_rate")}
								value={`${deliveryRate}%`}
								description={t("dashboard_notifications_successful_deliveries")}
								icon="solar:check-square-linear"
								color="green"
								className="flex-1"
							/>
							<DashboardStatsCard
								title={t("dashboard_notifications_read_rate")}
								value={`${readRate}%`}
								description={t("dashboard_notifications_opened_notification")}
								icon="solar:eye-linear"
								color="yellow"
								className="flex-1"
							/>
						</div>

						<div className="lg:col-span-8 lg:row-start-2 h-full flex flex-col">
							<Tabs
								key={`open-time-tabs-${isExpanded}`}
								selectedKey={openTimePeriod}
								defaultSelectedKey="Mensual"
								onSelectionChange={(key) => onOpenTimePeriodChange(key as OpenTimeDistributionPeriod)}
								aria-label={t("dashboard_notifications_open_time_distribution")}
								className="mb-2"
							>
								<Tab
									key="Mensual"
									title={t("dashboard_notifications_filter_monthly")}
								/>
								<Tab
									key="Semanal"
									title={t("dashboard_notifications_filter_weekly")}
								/>
							</Tabs>
							<AreaLineChart
								data={linearGraphData}
								xAxisKey="name"
								series={[
									{ dataKey: "email", color: "#3b82f6", label: t("dashboard_notifications_channel_email") },
									{ dataKey: "whatsapp", color: "#22c55e", label: t("dashboard_notifications_channel_whatsapp") },
								]}
								title={t("dashboard_notifications_open_time_distribution")}
								height={200}
								wrappedInCard
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
