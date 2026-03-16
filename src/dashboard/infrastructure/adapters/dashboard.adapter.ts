import { httpService } from "@http";
import type { IHttpClient } from "@http";
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
} from "../../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../../domain/ports/dashboard.port";
import type { GetCampaignStatsBasicDataDto } from "../dtos/get-campaign-stats-basic.dto";
import type { GetCampaignStatsMostActiveNetworkDataDto } from "../dtos/get-campaign-stats-most-active-network.dto";
import type { GetCampaignStatsOpenRateRankingDataDto } from "../dtos/get-campaign-stats-open-rate-ranking.dto";
import type { GetTagsStatsDataDto } from "../dtos/get-tags-stats.dto";
import type { GetClientsStatsDataDto } from "../dtos/get-clients-stats.dto";
import type { GetConfigurationProgressDataDto } from "../dtos/get-configuration-progress.dto";
import type { GetConversationsStatsDataDto } from "../dtos/get-conversations-stats.dto";
import type { GetConversationsStatsMonthlyDataDto } from "../dtos/get-conversations-stats-monthly.dto";
import type { GetNotificationStatsDataDto } from "../dtos/get-notification-stats.dto";
import type { GetOpenTimeDistributionDataDto } from "../dtos/get-open-time-distribution.dto";
import type { GetSocialMediaBasicDataDto } from "../dtos/get-social-media-basic.dto";
import type { GetSocialMediaMostActiveDataDto } from "../dtos/get-social-media-most-active.dto";
import type { SocialMediaReachRankingItemDto } from "../dtos/get-social-media-reach-ranking.dto";
import { toCampaignStatsBasicFromDto } from "../mappers/campaign-stats-basic.mapper";
import { toCampaignStatsMostActiveNetworkFromDto } from "../mappers/campaign-stats-most-active-network.mapper";
import { toCampaignListFromOpenRateRankingDto } from "../mappers/campaign-stats-open-rate-ranking.mapper";
import { toConversationsStatsFromDto } from "../mappers/conversations-stats.mapper";
import { toNotificationStatsFromDto } from "../mappers/notification-stats.mapper";
import { toOpenTimeDistributionFromDto } from "../mappers/open-time-distribution.mapper";
import { toSocialMediaBasicFromDto } from "../mappers/social-media-basic.mapper";
import { toSocialMediaMostActiveFromDto } from "../mappers/social-media-most-active.mapper";
import { toAiTagsStatsFromDto } from "../mappers/tags-stats.mapper";
import { toSocialMediaReachRankingFromDto } from "../mappers/social-media-reach-ranking.mapper";
import { toContactsStatsFromDto } from "../mappers/clients-stats.mapper";
import { toConfigurationProgressFromDto } from "../mappers/configuration-progress.mapper";
import type { ChannelMessageDto } from "../dtos/channel-message.dto.ts";
import { mapChannelMessageToAssistantSuggestion } from "../mappers/assistant-suggestion.mapper.ts";
import {
	mockAiTagsStats,
	mockCampaignStatsBasic,
	mockCampaignOpenRateRanking,
	mockCampaignStatsMostActiveNetwork,
	mockConversationsStats,
	mockNotificationStats,
	mockOpenTimeDistribution,
	mockSocialMediaStats,
	mockContactsStats,
	mockConfigurationProgress,
} from "../mocks/dashboard-response.mock";

export class DashboardAdapter implements IDashboardPort {
	private readonly httpClient: IHttpClient = httpService;

	/** Query string dateFrom/dateTo para endpoints que usan rango de fechas (notifications, open-time, social-media, campaigns, etc.) */
	private buildDateRangeQueryString(params: {
		dateFrom?: string;
		dateTo?: string;
	}): string {
		if (!params?.dateFrom && !params?.dateTo) return "";
		const queryParams = new URLSearchParams();
		if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
		if (params.dateTo) queryParams.append("dateTo", params.dateTo);
		return queryParams.toString();
	}

	async getNotificationStats(
		request?: IGetNotificationStatsRequest
	): Promise<INotificationStats> {
		try {
			const queryString = request
				? this.buildDateRangeQueryString(request)
				: "";
			const url = `/notifications/stats${queryString ? `?${queryString}` : ""}`;

			const response = await this.httpClient.get<GetNotificationStatsDataDto>(url);

			if (response.success && response.data) {
				return toNotificationStatsFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error("Error in DashboardAdapter.getNotificationStats:", error);
			return mockNotificationStats;
		}
	}

	async getOpenTimeDistribution(
		request?: IGetOpenTimeDistributionRequest
	): Promise<IOpenTimeDistribution> {
		try {
			const queryString = request
				? this.buildDateRangeQueryString(request)
				: "";
			const url = `/notifications/stats/open-time-distribution${queryString ? `?${queryString}` : ""}`;

			const response = await this.httpClient.get<GetOpenTimeDistributionDataDto>(url);

			if (response.success && response.data) {
				return toOpenTimeDistributionFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error("Error in DashboardAdapter.getOpenTimeDistribution:", error);
			return mockOpenTimeDistribution;
		}
	}

	async getConversationsStats(
		request?: IGetConversationsStatsRequest
	): Promise<IConversationsStats> {
		try {
			const baseQuery = request
				? this.buildDateRangeQueryString(request)
				: "";
			const queryParams = new URLSearchParams(baseQuery);
			if (request?.channelName?.length) {
				for (const channel of request.channelName) {
					queryParams.append("channelName", channel);
				}
			}
			const queryString = queryParams.toString();
			const url = `/linda/chat-sessions/stats${queryString ? `?${queryString}` : ""}`;

			const response = await this.httpClient.get<GetConversationsStatsDataDto>(url);
			if (response.success && response.data) {
				return toConversationsStatsFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error: unknown) {
			console.error("Error in DashboardAdapter.getConversationsStats:", error);
			return mockConversationsStats;
		}
	}

	async getConversationsStatsMonthly(
		request?: IGetConversationsStatsMonthlyRequest
	): Promise<IConversationsStatsMonthly> {
		try {
			const queryParams = new URLSearchParams();
			if (request?.channelName?.length) {
				for (const channel of request.channelName) {
					queryParams.append("channelName", channel);
				}
			}
			if (request?.timezone) {
				queryParams.append("timezone", request.timezone);
			}
			if (request?.agencyId) {
				queryParams.append("agency_id", request.agencyId);
			}
			const queryString = queryParams.toString();
			const url = `/linda/chat-sessions/stats/monthly${queryString ? `?${queryString}` : ""}`;

			const response = await this.httpClient.get<GetConversationsStatsMonthlyDataDto>(url);
			if (response.success && response.data) {
				return { monthlyConversations: response.data.monthlyConversations };
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error: unknown) {
			console.error("Error in DashboardAdapter.getConversationsStatsMonthly:", error);
			return { monthlyConversations: [] };
		}
	}

	async getSocialMediaStatsBasic(
		request: IGetSocialMediaStatsRequest
	): Promise<{ socialReach: number; reachPerPost: number; totalPosts: number }> {
		try {
			const queryString = this.buildDateRangeQueryString(request);
			const url = `/social-media/posts/stats/basic?${queryString}`;
			const response = await this.httpClient.get<GetSocialMediaBasicDataDto>(url);

			if (response.success && response.data) {
				return toSocialMediaBasicFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error("Error in DashboardAdapter.getSocialMediaStatsBasic:", error);
			return {
				socialReach: mockSocialMediaStats.socialReach,
				reachPerPost: mockSocialMediaStats.reachPerPost,
				totalPosts: mockSocialMediaStats.totalPosts,
			};
		}
	}

	async getSocialMediaStatsMostActiveNetwork(
		request: IGetSocialMediaStatsRequest
	): Promise<{
		network: string;
		engagementRate: number;
		likes: number;
		followerGrowth: number;
	}> {
		try {
			const queryString = this.buildDateRangeQueryString(request);
			const url = `/social-media/posts/stats/most-active-network?${queryString}`;
			const response = await this.httpClient.get<GetSocialMediaMostActiveDataDto>(url);

			if (response.success && response.data) {
				return toSocialMediaMostActiveFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error("Error in DashboardAdapter.getSocialMediaStatsMostActiveNetwork:", error);
			return {
				network: mockSocialMediaStats.network,
				engagementRate: mockSocialMediaStats.engagementRate,
				likes: mockSocialMediaStats.likes,
				followerGrowth: mockSocialMediaStats.followerGrowth,
			};
		}
	}

	async getSocialMediaStatsReachRanking(
		request: IGetSocialMediaStatsRequest
	): Promise<{ title: string; reach: number }[]> {
		try {
			const queryString = this.buildDateRangeQueryString(request);
			const url = `/social-media/posts/stats/reach-ranking?${queryString}`;
			const response = await this.httpClient.get<SocialMediaReachRankingItemDto[]>(url);

			if (response.success && response.data) {
				return toSocialMediaReachRankingFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error("Error in DashboardAdapter.getSocialMediaStatsReachRanking:", error);
			return mockSocialMediaStats.topPosts;
		}
	}

	async getCampaignStatsBasic(
		request: IGetCampaignStatsBasicRequest
	): Promise<ICampaignStatsBasic> {
		try {
			const queryString = this.buildDateRangeQueryString(request);
			const url = `/campaigns/stats/basic?${queryString}`;
			const response = await this.httpClient.get<GetCampaignStatsBasicDataDto>(url);

			if (response.success && response.data) {
				return toCampaignStatsBasicFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error("Error in DashboardAdapter.getCampaignStatsBasic:", error);
			return mockCampaignStatsBasic;
		}
	}

	async getCampaignStatsOpenRateRanking(
		request: IGetCampaignStatsBasicRequest
	): Promise<ICampaign[]> {
		try {
			const queryString = this.buildDateRangeQueryString(request);
			const url = `/campaigns/stats/open-rate-ranking?${queryString}`;
			const response = await this.httpClient.get<GetCampaignStatsOpenRateRankingDataDto>(url);

			if (response.success && response.data) {
				return toCampaignListFromOpenRateRankingDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error(
				"Error in DashboardAdapter.getCampaignStatsOpenRateRanking:",
				error
			);
			return mockCampaignOpenRateRanking;
		}
	}

	async getCampaignStatsMostActiveNetwork(
		request: IGetCampaignStatsBasicRequest
	): Promise<ICampaignStatsMostActiveNetwork> {
		try {
			const queryString = this.buildDateRangeQueryString(request);
			const url = `/campaigns/stats/most-active-network?${queryString}`;
			const response = await this.httpClient.get<GetCampaignStatsMostActiveNetworkDataDto>(url);

			if (response.success && response.data) {
				return toCampaignStatsMostActiveNetworkFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error(
				"Error in DashboardAdapter.getCampaignStatsMostActiveNetwork:",
				error
			);
			return mockCampaignStatsMostActiveNetwork;
		}
	}

	private buildTagsStatsQueryString(request: IGetTagsStatsRequest): string {
		const queryParams = new URLSearchParams();
		if (request.dateFrom) queryParams.append("dateFrom", request.dateFrom);
		if (request.dateTo) queryParams.append("dateTo", request.dateTo);
		if (request.granularity) queryParams.append("granularity", request.granularity);
		if (request.timezone) queryParams.append("timezone", request.timezone);
		if (request.topN != null) queryParams.append("topN", String(request.topN));
		return queryParams.toString();
	}

	async getTagsStats(request: IGetTagsStatsRequest): Promise<IAiTagsStats> {
		try {
			const queryString = this.buildTagsStatsQueryString(request);
			const url = `/tags/stats/ai${queryString ? `?${queryString}` : ""}`;
			const response = await this.httpClient.get<GetTagsStatsDataDto>(url);

			if (response.success && response.data) {
				return toAiTagsStatsFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error("Error in DashboardAdapter.getTagsStats:", error);
			return mockAiTagsStats;
		}
	}

	private buildContactsStatsQueryString(
		request: IGetContactsStatsRequest
	): string {
		const queryParams = new URLSearchParams();
		if (request.granularity) queryParams.append("granularity", request.granularity);
		if (request.timezone) queryParams.append("timezone", request.timezone);
		if (request.dateFrom) queryParams.append("dateFrom", request.dateFrom);
		if (request.dateTo) queryParams.append("dateTo", request.dateTo);
		return queryParams.toString();
	}

	async getContactsStats(
		request: IGetContactsStatsRequest
	): Promise<IContactsStats> {
		try {
			const queryString = this.buildContactsStatsQueryString(request);
			const url = `/clients/stats${queryString ? `?${queryString}` : ""}`;
			const response = await this.httpClient.get<GetClientsStatsDataDto>(url);

			if (response.success && response.data) {
				return toContactsStatsFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error("Error in DashboardAdapter.getContactsStats:", error);
			return mockContactsStats;
		}
	}

	async getConfigurationProgress(): Promise<IConfigurationProgress> {
		try {
			const url = "/companies/me/configuration-progress";
			const response =
				await this.httpClient.get<GetConfigurationProgressDataDto>(url);

			if (response.success && response.data) {
				return toConfigurationProgressFromDto(response.data);
			}

			throw new Error(
				(response as { error?: { code?: string }; message?: string }).error?.code ||
					(response as { message?: string }).message ||
					"API call failed"
			);
		} catch (error) {
			console.error(
				"Error in DashboardAdapter.getConfigurationProgress:",
				error
			);
			return mockConfigurationProgress;
		}
	}

	async getAssistantSuggestions(): Promise<IAssistantSuggestionAlert[]> {
		try {
			const qs = new URLSearchParams();
			qs.append("status", "SENT");
			qs.append("status", "DELIVERED");
			qs.append("type", "webpush");
			qs.append("category", "assistant_suggestion");

			const response = await this.httpClient.get<{
				items: ChannelMessageDto[];
				total: number;
			}>(`/channels/messages?${qs.toString()}`);

			if (response.success && response.data) {
				const items = response.data.items ?? [];
				return items.map(mapChannelMessageToAssistantSuggestion);
			}

			return [];
		} catch (error) {
			console.error(
				"Error in DashboardAdapter.getAssistantSuggestions:",
				error
			);
			return [];
		}
	}
}

