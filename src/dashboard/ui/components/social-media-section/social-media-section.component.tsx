import { Card, H4 } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { Progress } from "@heroui/react";
import type { FC } from "react";
import type { ISocialMediaStats } from "../../../domain/interfaces/dashboard.interface";
import { CollapsibleHeader, DashboardStatsCard, SectionNoDataOverlay } from "../";

export interface SocialMediaSectionProps {
	isExpanded: boolean;
	onToggle: () => void;
	data: ISocialMediaStats | null;
}

export const SocialMediaSection: FC<SocialMediaSectionProps> = ({
	isExpanded,
	onToggle,
	data,
}) => {
	const { t } = useTranslate();

	const socialReach = data?.socialReach ?? 0;
	const reachPerPost = data?.reachPerPost ?? 0;
	const totalPosts = data?.totalPosts ?? 0;
	const totalStories = data?.totalStories ?? 0;
	// TODO: show when implemented endpoints get data
	// const engagementRate = data?.engagementRate ?? 0;
	// const followerGrowth = data?.followerGrowth ?? 0;
	// const likes = data?.likes ?? 0;
	const topPosts = data?.topPosts ?? [];
	const maxReach = data?.maxReach ?? 1;

	const allStatsZero =
		socialReach === 0 &&
		reachPerPost === 0 &&
		totalPosts === 0 &&
		totalStories === 0;
	const listHasNoData =
		topPosts.length === 0 || topPosts.every((p) => p.reach === 0);
	const hasNoData = data !== null && allStatsZero && listHasNoData;

	return (
		<div className="bg-white rounded-lg shadow-sm border mb-6">
			<CollapsibleHeader
				title={t("dashboard_social_media_summary", "Resumen de Redes Sociales")}
				isExpanded={isExpanded}
				onToggle={onToggle}
			/>

			{isExpanded && (
				<div className="px-4 pb-4 space-y-4 relative">
					{hasNoData && <SectionNoDataOverlay />}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DashboardStatsCard
							title={t("dashboard_social_total_reach", "Alcance total")}
							value={socialReach.toLocaleString()}
							icon="solar:graph-up-linear"
							color="blue"
							noBackground
							tooltip={t(
								"dashboard_social_total_reach_tooltip",
								"Mido qué tan lejos llegan tus publicaciones y cuántas personas están viendo tu mensaje"
							)}
						/>
						<DashboardStatsCard
							title={t("dashboard_social_reach_per_post", "Alcance por publicación")}
							value={reachPerPost.toLocaleString()}
							icon="solar:graph-up-linear"
							color="blue"
							noBackground
							tooltip={t(
								"dashboard_social_reach_per_post_tooltip",
								"Este es el promedio de personas que alcanzan tus publicaciones"
							)}
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
						{/* TODO: show when implemented endpoints get data */}
						{/* <div className="lg:col-span-4 grid auto-rows-fr gap-4">
							<DashboardStatsCard
								title={t("dashboard_social_likes", "Cantidad de Likes")}
								value={likes.toLocaleString()}
								icon="solar:heart-linear"
								color="yellow"
								noBackground
							/>
							<DashboardStatsCard
								title={t("dashboard_social_engagement_rate", "Tasa de Interacción")}
								value={engagementRate.toString()}
								icon="solar:heart-linear"
								color="yellow"
								noBackground
								tooltip={t(
									"dashboard_social_engagement_tooltip",
									"Mido el interés y la relevancia que tu contenido genera en tu audiencia"
								)}
							/>
							<DashboardStatsCard
								title={t("dashboard_social_new_followers", "Nuevos Seguidores")}
								value={Math.round(followerGrowth).toLocaleString()}
								icon="solar:users-group-rounded-linear"
								color="green"
								trend={{ value: followerGrowth, isPositive: true }}
								noBackground
							/>
						</div> */}

						{/* <div className="lg:col-span-8"> TODO: show when implemented cards top */}
						<div className="lg:col-span-12">
							<Card className="p-4 border border-gray-100 shadow-sm h-full">
								<div className="flex items-center justify-between mb-3">
									<H4 className="text-sm font-semibold text-gray-900">
										{t(
											"dashboard_social_top_posts_title",
											"Top 5 publicaciones con mayor alcance"
										)}
									</H4>
									<div className="flex items-center gap-3 text-xs text-gray-600">
										<div className="flex items-baseline gap-1">
											<span className="font-bold text-gray-900">
												{totalPosts.toLocaleString()}
											</span>
											<span>{t("dashboard_social_posts_label", "Posts")}</span>
										</div>
										<div className="flex items-baseline gap-1">
											<span className="font-bold text-gray-900">
												{totalStories.toLocaleString()}
											</span>
											<span>{t("dashboard_social_stories_label", "Stories")}</span>
										</div>
									</div>
								</div>
								<div className="space-y-3">
									{topPosts.map((post, index) => (
										<div key={`${post.title}-${index}`} className="space-y-1">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<span className="text-xs text-gray-400 w-4 text-right">
														{index + 1}.
													</span>
													<span className="text-sm text-gray-700">
														{post.title}
													</span>
												</div>
												<span className="text-xs font-semibold text-gray-900">
													{post.reach.toLocaleString()}
												</span>
											</div>
											<Progress
												value={maxReach > 0 ? (post.reach / maxReach) * 100 : 0}
												color="default"
												className="max-w-full"
												size="md"
												classNames={{
													indicator: "bg-blue-200",
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
