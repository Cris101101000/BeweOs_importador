import type {
	IGetSocialMediaStatsRequest,
	ISocialMediaStats,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

/**
 * Obtiene la data unificada de redes sociales llamando a los 3 endpoints:
 * basic, most-active-network, reach-ranking. Calcula maxReach desde topPosts.
 */
export class GetSocialMediaStatsUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(request: IGetSocialMediaStatsRequest): Promise<ISocialMediaStats> {
		try {
			const [basic, mostActive, topPosts] = await Promise.all([
				this.dashboardPort.getSocialMediaStatsBasic(request),
				this.dashboardPort.getSocialMediaStatsMostActiveNetwork(request),
				this.dashboardPort.getSocialMediaStatsReachRanking(request),
			]);
			const maxReach =
				topPosts.length > 0
					? Math.max(...topPosts.map((p) => p.reach))
					: 0;
			return {
				socialReach: basic.socialReach,
				reachPerPost: basic.reachPerPost,
				totalPosts: basic.totalPosts,
				totalStories: 0,
				network: mostActive.network,
				engagementRate: mostActive.engagementRate,
				likes: mostActive.likes,
				followerGrowth: mostActive.followerGrowth,
				topPosts,
				maxReach,
			};
		} catch (error) {
			console.error("Error fetching social media stats:", error);
			throw error;
		}
	}
}
