import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardAdapter } from "../../infrastructure/adapters/dashboard.adapter";
import { GetCampaignStatsBasicUseCase } from "../../application/get-campaign-stats-basic.usecase";
import { GetCampaignStatsMostActiveNetworkUseCase } from "../../application/get-campaign-stats-most-active-network.usecase";
import { GetCampaignStatsOpenRateRankingUseCase } from "../../application/get-campaign-stats-open-rate-ranking.usecase";
import { GetConversationsStatsUseCase } from "../../application/get-conversations-stats.usecase";
import { GetConversationsStatsMonthlyUseCase } from "../../application/get-conversations-stats-monthly.usecase";
import { GetNotificationStatsUseCase } from "../../application/get-notification-stats.usecase";
import { GetOpenTimeDistributionUseCase } from "../../application/get-open-time-distribution.usecase";
import { GetSocialMediaStatsUseCase } from "../../application/get-social-media-stats.usecase";
import { GetTagsStatsUseCase } from "../../application/get-tags-stats.usecase";
import { GetContactsStatsUseCase } from "../../application/get-contacts-stats.usecase";
import { GetConfigurationProgressUseCase } from "../../application/get-configuration-progress.usecase";
import { toLinearGraphDataFromOpenTimeDistribution } from "../../infrastructure/mappers/open-time-distribution.mapper";
import { GetAssistantSuggestionsUseCase } from "@dashboard/application";

import type {
	IAiTagsStats,
	IAssistantSuggestionAlert,
	ICampaignStats,
	ICampaignStatsBasic,
	ICampaignStatsMostActiveNetwork,
	ICampaign,
	IConfigurationProgress,
	IContactsStats,
	IConversationsStats,
	IDashboardData,
	IGetTagsStatsRequest,
	ILinearGraphDataPoint,
	INotificationStats,
	OperationalSummaryData,
	ISocialMediaStats,
} from "../../domain/interfaces/dashboard.interface";
import type { LineChartData } from "../../domain/interfaces/dashboard.interface";
import {
	getDateRangeForOpenTimePeriod,
	type OpenTimeDistributionPeriod,
} from "./use-open-time-distribution.hook";

const defaultCampaignStats: ICampaignStats = {
	totalCampaigns: 0,
	totalCampaignsTrend: undefined,
	interactionRate: 0,
	interactionRateTrend: undefined,
	campaignRanking: [],
	conversionRate: "0%",
	customerAcquisitionCost: 0,
	returnOnInvestment: 0,
};

function buildCampaignStats(
	basic: ICampaignStatsBasic | null,
	mostActive: ICampaignStatsMostActiveNetwork | null,
	ranking: ICampaign[]
): ICampaignStats {
	return {
		totalCampaigns: basic?.totalCampaigns ?? 0,
		totalCampaignsTrend: basic?.totalCampaignsTrend,
		interactionRate: basic?.interactionRate ?? 0,
		interactionRateTrend: basic?.interactionRateTrend,
		campaignRanking: ranking ?? [],
		conversionRate: `${mostActive?.conversionRate ?? 0}%`,
		customerAcquisitionCost: mostActive?.customerAcquisitionCost ?? 0,
		returnOnInvestment: mostActive?.returnOnInvestment ?? 0,
	};
}

/** Construye OperationalSummaryData desde configuration progress API + datos del dashboard (solo campos usados por el componente). */
function buildOperationalSummaryData(
	configurationProgress: IConfigurationProgress,
	campaignStats: ICampaignStats,
	tagsStats: IAiTagsStats,
	conversationsStats: IConversationsStats,
	socialMediaStats: ISocialMediaStats | null,
	notificationStats: INotificationStats | null,
	contactsStats: IContactsStats
): OperationalSummaryData {
	return {
		totalConversations: conversationsStats.totalConversations,
		totalCampaigns: campaignStats.totalCampaigns,
		followerGrowth: socialMediaStats?.followerGrowth ?? 0,
		unusedTags: Math.max(0, tagsStats.totalTags - tagsStats.tagsInUse),
		mostActiveNetwork: socialMediaStats?.network ?? "",
		totalAITags: tagsStats.totalTags,
		totalNotifications: notificationStats?.sentCount ?? 0,
		totalSocialPosts: socialMediaStats?.totalPosts ?? 0,
		topProducts: [],
		activeClients: contactsStats.totalContacts,
		configurationPercentage: configurationProgress.percentageCompleted,
	};
}

/** Rango por defecto para notificaciones (último mes) */
function getDefaultNotificationDateRange() {
	const now = new Date();
	const oneMonthAgo = new Date(now);
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
	oneMonthAgo.setHours(0, 0, 0, 0);
	const endOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		23,
		59,
		59,
		999
	);
	return {
		dateFrom: oneMonthAgo.toISOString(),
		dateTo: endOfToday.toISOString(),
	};
}

/** Data unificada del dashboard: una sola fuente de verdad por sección */
export interface DashboardPageData {
	dashboardData: IDashboardData | null;
	notificationStats: INotificationStats | null;
	conversationsStats: IConversationsStats | null;
	socialMediaStats: ISocialMediaStats | null;
	campaignStats: ICampaignStats;
	tagsStats: IAiTagsStats;
	contactsStats: IContactsStats;
	operationalSummary: OperationalSummaryData;
	openTimeDistributionData: ILinearGraphDataPoint[];
	assistantSuggestions: IAssistantSuggestionAlert[];
}

export interface UseDashboardParams {
	openTimePeriod?: OpenTimeDistributionPeriod;
	agencyId?: string;
}

interface UseDashboardResponse {
	data: DashboardPageData;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

const defaultContactsStats: IContactsStats = {
	totalContacts: 0,
	totalContactsTrend: null,
	newContacts: 0,
	newContactsTrend: null,
	contactsGeneratedByLinda: 0,
	contactsGeneratedByLindaTrend: null,
};

const defaultOperationalSummary: OperationalSummaryData = {
	totalConversations: 0,
	totalCampaigns: 0,
	followerGrowth: 0,
	unusedTags: 0,
	mostActiveNetwork: "",
	totalAITags: 0,
	totalNotifications: 0,
	totalSocialPosts: 0,
	topProducts: [],
	activeClients: 0,
	configurationPercentage: 0,
};

const initialData: DashboardPageData = {
	dashboardData: null,
	notificationStats: null,
	conversationsStats: null,
	socialMediaStats: null,
	campaignStats: defaultCampaignStats,
	tagsStats: {
		newTagsPerMonth: 0,
		newTagsPerMonthTrend: 0,
		totalTags: 0,
		tagsInUse: 0,
		topTags: [],
	},
	contactsStats: defaultContactsStats,
	operationalSummary: defaultOperationalSummary,
	assistantSuggestions: [],
	openTimeDistributionData: [],
};

const MONTHLY_CHART_LAST_N_MONTHS = 6;

/** Convierte monthlyConversations a LineChartData[] mostrando los últimos N meses con etiqueta legible (ej. "Mar 2026"). */
function monthlyConversationsToLineChartData(
	monthlyConversations: Array<{ month: string; totalConversations: number }>
): LineChartData[] {
	const lastN = monthlyConversations.slice(-MONTHLY_CHART_LAST_N_MONTHS);
	return lastN.map((item) => {
		const [year, monthStr] = item.month.split("-");
		const monthIndex = Number.parseInt(monthStr, 10) - 1;
		const date = new Date(Number(year), monthIndex, 1);
		const label = new Intl.DateTimeFormat("es", {
			month: "short",
			year: "numeric",
		}).format(date);
		const capitalizedLabel =
			label.charAt(0).toUpperCase() + label.slice(1);
		return {
			label: capitalizedLabel,
			value: item.totalConversations,
		};
	});
}

/**
 * Hook unificado del dashboard: obtiene dashboard data, notification stats
 * y open time distribution. Al cambiar openTimePeriod se vuelve a pedir solo
 * la distribución de tiempo de apertura.
 */
export const useDashboard = (
	params?: UseDashboardParams
): UseDashboardResponse => {
	const openTimePeriod = params?.openTimePeriod ?? "Mensual";
	const agencyId = params?.agencyId;

	const [data, setData] = useState<DashboardPageData>(initialData);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const adapter = useMemo(() => new DashboardAdapter(), []);
	const notificationStatsUseCase = useMemo(
		() => new GetNotificationStatsUseCase(adapter),
		[adapter]
	);
	const openTimeDistributionUseCase = useMemo(
		() => new GetOpenTimeDistributionUseCase(adapter),
		[adapter]
	);
	const conversationsStatsUseCase = useMemo(
		() => new GetConversationsStatsUseCase(adapter),
		[adapter]
	);
	const conversationsStatsMonthlyUseCase = useMemo(
		() => new GetConversationsStatsMonthlyUseCase(adapter),
		[adapter]
	);
	const socialMediaStatsUseCase = useMemo(
		() => new GetSocialMediaStatsUseCase(adapter),
		[adapter]
	);
	const campaignStatsBasicUseCase = useMemo(
		() => new GetCampaignStatsBasicUseCase(adapter),
		[adapter]
	);
	const campaignStatsMostActiveNetworkUseCase = useMemo(
		() => new GetCampaignStatsMostActiveNetworkUseCase(adapter),
		[adapter]
	);
	const campaignStatsOpenRateRankingUseCase = useMemo(
		() => new GetCampaignStatsOpenRateRankingUseCase(adapter),
		[adapter]
	);
	const tagsStatsUseCase = useMemo(
		() => new GetTagsStatsUseCase(adapter),
		[adapter]
	);
	const contactsStatsUseCase = useMemo(
		() => new GetContactsStatsUseCase(adapter),
		[adapter]
	);
	const configurationProgressUseCase = useMemo(
		() => new GetConfigurationProgressUseCase(adapter),
		[adapter]
	);
	const assistantSuggestionsUseCase = useMemo(
		() => new GetAssistantSuggestionsUseCase(adapter),
		[adapter]
	);

	const notificationDateRange = useMemo(
		getDefaultNotificationDateRange,
		[]
	);
	const openTimeDateRange = useMemo(
		() => getDateRangeForOpenTimePeriod(openTimePeriod),
		[openTimePeriod]
	);
	const tagsStatsRequest = useMemo<IGetTagsStatsRequest>(
		() => ({
			...notificationDateRange,
			granularity: "month",
			timezone: "America/Bogota",
			topN: 5,
		}),
		[notificationDateRange]
	);
	const contactsStatsRequest = useMemo(
		() => ({
			...notificationDateRange,
			granularity: "month",
			timezone: "America/Bogota",
		}),
		[notificationDateRange]
	);
	const conversationsStatsMonthlyRequest = useMemo(
		() => ({
			channelName: ["web", "whatsapp"],
			timezone: "America/Bogota",
			agencyId: agencyId ?? undefined,
		}),
		[agencyId]
	);

	// Fetch dashboard data + notification stats + conversations stats + monthly chart + social media stats + campaign stats + tags stats (una vez al montar)
	const fetchCore = useCallback(async () => {
		try {
			const [
				statsResult,
				conversationsStatsResult,
				conversationsStatsMonthlyResult,
				socialMediaStatsResult,
				campaignStatsBasicResult,
				campaignStatsMostActiveNetworkResult,
				campaignOpenRateRankingResult,
				tagsStatsResult,
				contactsStatsResult,
				configurationProgressResult,
				assistantSuggestionsResult
			] = await Promise.all([
				notificationStatsUseCase.execute(notificationDateRange),
				conversationsStatsUseCase.execute(notificationDateRange),
				conversationsStatsMonthlyUseCase.execute(
					conversationsStatsMonthlyRequest
				),
				socialMediaStatsUseCase.execute(notificationDateRange),
				campaignStatsBasicUseCase.execute(notificationDateRange),
				campaignStatsMostActiveNetworkUseCase.execute(notificationDateRange),
				campaignStatsOpenRateRankingUseCase.execute(notificationDateRange),
				tagsStatsUseCase.execute(tagsStatsRequest),
				contactsStatsUseCase.execute(contactsStatsRequest),
				configurationProgressUseCase.execute(),
				assistantSuggestionsUseCase.execute(),
			]);
			const campaignStats = buildCampaignStats(
				campaignStatsBasicResult,
				campaignStatsMostActiveNetworkResult,
				campaignOpenRateRankingResult
			);
			const operationalSummary = buildOperationalSummaryData(
				configurationProgressResult,
				campaignStats,
				tagsStatsResult,
				conversationsStatsResult,
				socialMediaStatsResult,
				statsResult,
				contactsStatsResult
			);
			const conversationData = monthlyConversationsToLineChartData(
				conversationsStatsMonthlyResult.monthlyConversations
			);
			setData((prev) => ({
				...prev,
				dashboardData: {
					conversationData,
					operationalSummary,
					campaignData: [],
					socialMediaPosts: [],
					linearGraphData: [],
				},
				notificationStats: statsResult,
				conversationsStats: conversationsStatsResult,
				socialMediaStats: socialMediaStatsResult,
				campaignStats,
				tagsStats: tagsStatsResult,
				contactsStats: contactsStatsResult,
				operationalSummary,
				assistantSuggestions: assistantSuggestionsResult,
			}));
		} catch (err) {
			setError(err as Error);
			setData((prev) => ({
				...prev,
				dashboardData: null,
				notificationStats: null,
				conversationsStats: null,
				socialMediaStats: null,
				campaignStats: defaultCampaignStats,
				tagsStats: {
					newTagsPerMonth: 0,
					newTagsPerMonthTrend: 0,
					totalTags: 0,
					tagsInUse: 0,
					topTags: [],
				},
				contactsStats: defaultContactsStats,
				operationalSummary: defaultOperationalSummary,
				assistantSuggestions: [],
			}));
		}
	}, [
		notificationStatsUseCase,
		conversationsStatsUseCase,
		conversationsStatsMonthlyUseCase,
		socialMediaStatsUseCase,
		campaignStatsBasicUseCase,
		campaignStatsMostActiveNetworkUseCase,
		campaignStatsOpenRateRankingUseCase,
		tagsStatsUseCase,
		contactsStatsUseCase,
		assistantSuggestionsUseCase,
		configurationProgressUseCase,
		notificationDateRange,
		tagsStatsRequest,
		contactsStatsRequest,
		conversationsStatsMonthlyRequest,
	]);

	// Fetch open time distribution (al montar y cuando cambia openTimePeriod)
	const fetchOpenTimeDistribution = useCallback(async () => {
		try {
			const result = await openTimeDistributionUseCase.execute(
				openTimeDateRange
			);
			setData((prev) => ({
				...prev,
				openTimeDistributionData:
					toLinearGraphDataFromOpenTimeDistribution(result),
			}));
		} catch (err) {
			setError(err as Error);
			setData((prev) => ({
				...prev,
				openTimeDistributionData: [],
			}));
		}
	}, [openTimeDistributionUseCase, openTimeDateRange]);

	useEffect(() => {
		let isActive = true;
		setIsLoading(true);
		setError(null);
		fetchCore()
			.then(() => {
				if (isActive) setIsLoading(false);
			})
			.catch(() => {
				if (isActive) setIsLoading(false);
			});
		return () => {
			isActive = false;
		};
	}, [fetchCore]);

	useEffect(() => {
		let isActive = true;
		fetchOpenTimeDistribution();
		return () => {
			isActive = false;
		};
	}, [fetchOpenTimeDistribution]);

	const refetch = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			await Promise.all([
				fetchCore(),
				fetchOpenTimeDistribution(),
			]);
		} finally {
			setIsLoading(false);
		}
	}, [fetchCore, fetchOpenTimeDistribution]);

	return {
		data,
		isLoading,
		error,
		refetch,
	};
};
