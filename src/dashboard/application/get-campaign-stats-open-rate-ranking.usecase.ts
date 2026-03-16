import type {
	ICampaign,
	IGetCampaignStatsBasicRequest,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetCampaignStatsOpenRateRankingUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(
		request: IGetCampaignStatsBasicRequest
	): Promise<ICampaign[]> {
		try {
			return await this.dashboardPort.getCampaignStatsOpenRateRanking(
				request
			);
		} catch (error) {
			console.error(
				"Error fetching campaign stats open rate ranking:",
				error
			);
			throw error;
		}
	}
}
