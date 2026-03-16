import { Card, SimpleLineChart } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import type {
	IConversationsStats,
	LineChartData,
} from "../../../domain/interfaces/dashboard.interface";
import { CollapsibleHeader, DashboardStatsCard, SectionNoDataOverlay } from "../";

export interface ConversationsSectionProps {
	isExpanded: boolean;
	onToggle: () => void;
	conversationData: LineChartData[];
	conversationsStats: IConversationsStats | null;
}

export const ConversationsSection: FC<ConversationsSectionProps> = ({
	isExpanded,
	onToggle,
	conversationData,
	conversationsStats,
}) => {
	const { t } = useTranslate();
	const totalConversations = conversationsStats?.totalConversations ?? 0;
	const answeredQuestions = conversationsStats?.answeredQuestions ?? 0;
	const pendingQuestions = conversationsStats?.pendingQuestions ?? 0;
	const pendingGaps = conversationsStats?.pendingGaps ?? 0;
	const totalConversationsTrend = conversationsStats?.totalConversationsTrend ?? undefined;
	const answeredQuestionsTrend = conversationsStats?.answeredQuestionsTrend ?? undefined;
	const pendingQuestionsTrend = conversationsStats?.pendingQuestionsTrend ?? undefined;
	const pendingGapsTrend = conversationsStats?.pendingGapsTrend ?? undefined;

	const allStatsZero =
		totalConversations === 0 &&
		answeredQuestions === 0 &&
		pendingQuestions === 0 &&
		pendingGaps === 0;
	const chartHasNoData =
		conversationData.length === 0 ||
		conversationData.every((d) => d.value === 0);
	const hasNoData =
		conversationsStats !== null && allStatsZero && chartHasNoData;

	return (
		<div className="bg-white rounded-lg shadow-sm border mb-6">
			<CollapsibleHeader
				title={t("dashboard_conversations_title")}
				isExpanded={isExpanded}
				onToggle={onToggle}
			/>

			{isExpanded && (
				<div className="px-4 pb-4 space-y-4 relative">
					{hasNoData && <SectionNoDataOverlay />}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
						<div className="lg:col-span-5 order-1 h-full">
							<div className="flex flex-col gap-3 h-full">
								<DashboardStatsCard
									title={t("dashboard_conversations_total")}
									value={String(totalConversations)}
									icon="solar:chat-round-dots-linear"
									color="blue"
									trend={totalConversationsTrend ?? undefined}
									className="!m-0 flex-1"
								/>
								<DashboardStatsCard
									title={t("dashboard_conversations_answered_questions")}
									value={String(answeredQuestions)}
									icon="solar:check-circle-linear"
									color="green"
									trend={answeredQuestionsTrend ?? undefined}
									className="!m-0 flex-1"
								/>
								<DashboardStatsCard
									title={t("dashboard_conversations_pending_questions")}
									value={String(pendingQuestions)}
									icon="solar:clock-circle-linear"
									color="yellow"
									trend={pendingQuestionsTrend ?? undefined}
									className="!m-0 flex-1"
								/>
								<DashboardStatsCard
									title={t("dashboard_conversations_pending_gaps")}
									value={String(pendingGaps)}
									icon="solar:question-square-linear"
									color="red"
									trend={pendingGapsTrend ?? undefined}
									className="!m-0 flex-1"
								/>
							</div>
						</div>
						<div className="lg:col-span-7 order-2">
							<Card className="p-6 h-full">
								<SimpleLineChart
									data={conversationData}
									title={t("dashboard_conversations_trend")}
									color="#3b82f6"
									height={340}
								/>
							</Card>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

