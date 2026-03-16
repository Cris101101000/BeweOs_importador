import { useTranslate } from "@tolgee/react";
import { Card, H4, Chip } from "@beweco/aurora-ui";
import type { FC } from "react";
import type { IAiTagsStats } from "../../../domain/interfaces/dashboard.interface";
import { CollapsibleHeader, DashboardStatsCard, SectionNoDataOverlay } from "../";

export type AITagsSectionData = IAiTagsStats;

export interface AITagsSectionProps {
	isExpanded: boolean;
	onToggle: () => void;
	data: IAiTagsStats;
}

export const AITagsSection: FC<AITagsSectionProps> = ({
	isExpanded,
	onToggle,
	data,
}) => {
	const { t } = useTranslate();
	const trend = {
		value: Math.abs(data.newTagsPerMonthTrend),
		isPositive: data.newTagsPerMonthTrend >= 0,
	};

	const allStatsZero =
		data.newTagsPerMonth === 0 &&
		data.totalTags === 0 &&
		data.tagsInUse === 0;
	const topTagsHasNoData =
		!data.topTags?.length || data.topTags.every((tag) => tag.count === 0);
	const hasNoData = allStatsZero && topTagsHasNoData;

	return (
		<div className="bg-white rounded-lg shadow-sm border mb-6">
			<CollapsibleHeader
				title={t("dashboard_ai_tags_summary", "Etiquetas de IA")}
				isExpanded={isExpanded}
				onToggle={onToggle}
			/>

			{isExpanded && (
				<div className="px-4 pb-4 relative">
					{hasNoData && <SectionNoDataOverlay />}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div className="flex flex-col gap-4 h-full">
							<DashboardStatsCard
								title={t(
									"dashboard_ai_tags_new_per_period",
									"Etiquetas creadas por periodo"
								)}
								value={String(data.newTagsPerMonth)}
								icon="solar:add-square-linear"
								color="purple"
								trend={trend}
								className="flex-1"
							/>
							<DashboardStatsCard
								title={t("dashboard_total_ai_tags", "Total Etiquetas")}
								value={data.totalTags.toLocaleString()}
								icon="solar:tag-price-linear"
								color="purple"
								className="flex-1"
							/>
							<DashboardStatsCard
								title={t("dashboard_ai_tags_in_use", "Etiquetas en uso")}
								value={String(data.tagsInUse)}
								icon="solar:danger-triangle-linear"
								color="yellow"
								className="flex-1"
							/>
						</div>

						<Card className="p-6">
							<div className="mb-4">
								<H4 className="text-base font-semibold text-gray-900">
									{t(
										"dashboard_top_ai_tags",
										"Top 5 Etiquetas Más Usadas"
									)}
								</H4>
							</div>
							<div className="space-y-3">
								{data.topTags.map((tag, index) => (
									<div
										key={tag.label}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<span className="text-gray-500 font-medium text-sm w-6">
												{index + 1}.
											</span>
											<Chip color={tag.color} size="sm" variant="flat">
												{tag.label}
											</Chip>
										</div>
										<span className="text-sm font-semibold text-gray-700">
											{tag.count}
										</span>
									</div>
								))}
							</div>
						</Card>
					</div>
				</div>
			)}
		</div>
	);
};

