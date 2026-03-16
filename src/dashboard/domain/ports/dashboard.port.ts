import type {
	IAiTagsStats,
	IAssistantSuggestionAlert,
	ICampaign,
	ICampaignStatsBasic,
	ICampaignStatsMostActiveNetwork,
	IConfigurationProgress,
	IContactsStats,
	IConversationsStats,
	IConversationsStatsMonthly,
	IGetCampaignStatsBasicRequest,
	IGetContactsStatsRequest,
	IGetConversationsStatsRequest,
	IGetConversationsStatsMonthlyRequest,
	IGetNotificationStatsRequest,
	IGetOpenTimeDistributionRequest,
	IGetSocialMediaStatsRequest,
	IGetTagsStatsRequest,
	INotificationStats,
	IOpenTimeDistribution,
	ISocialMediaPost,
} from "../interfaces/dashboard.interface";

export interface IDashboardPort {
	getNotificationStats(
		request?: IGetNotificationStatsRequest
	): Promise<INotificationStats>;
	getOpenTimeDistribution(
		request?: IGetOpenTimeDistributionRequest
	): Promise<IOpenTimeDistribution>;
	getConversationsStats(
		request?: IGetConversationsStatsRequest
	): Promise<IConversationsStats>;
	getConversationsStatsMonthly(
		request?: IGetConversationsStatsMonthlyRequest
	): Promise<IConversationsStatsMonthly>;
	getSocialMediaStatsBasic(
		request: IGetSocialMediaStatsRequest
	): Promise<{ socialReach: number; reachPerPost: number; totalPosts: number }>;
	getSocialMediaStatsMostActiveNetwork(
		request: IGetSocialMediaStatsRequest
	): Promise<{
		network: string;
		engagementRate: number;
		likes: number;
		followerGrowth: number;
	}>;
	getSocialMediaStatsReachRanking(
		request: IGetSocialMediaStatsRequest
	): Promise<ISocialMediaPost[]>;
	getCampaignStatsBasic(
		request: IGetCampaignStatsBasicRequest
	): Promise<ICampaignStatsBasic>;
	getCampaignStatsOpenRateRanking(
		request: IGetCampaignStatsBasicRequest
	): Promise<ICampaign[]>;
	getCampaignStatsMostActiveNetwork(
		request: IGetCampaignStatsBasicRequest
	): Promise<ICampaignStatsMostActiveNetwork>;
	getTagsStats(request: IGetTagsStatsRequest): Promise<IAiTagsStats>;
	getContactsStats(
		request: IGetContactsStatsRequest
	): Promise<IContactsStats>;
	getConfigurationProgress(): Promise<IConfigurationProgress>;
	getAssistantSuggestions(): Promise<IAssistantSuggestionAlert[]>;
}

