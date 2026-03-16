import type {
	ICampaignStatsMostActiveNetwork,
	IGetCampaignStatsBasicRequest,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetCampaignStatsMostActiveNetworkUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(
		request: IGetCampaignStatsBasicRequest
	): Promise<ICampaignStatsMostActiveNetwork> {
		try {
			return await this.dashboardPort.getCampaignStatsMostActiveNetwork(
				request
			);
		} catch (error) {
			console.error(
				"Error fetching campaign stats most active network:",
				error
			);
			throw error;
		}
	}
}
