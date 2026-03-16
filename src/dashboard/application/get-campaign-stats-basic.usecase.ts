import type {
	ICampaignStatsBasic,
	IGetCampaignStatsBasicRequest,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetCampaignStatsBasicUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(
		request?: IGetCampaignStatsBasicRequest
	): Promise<ICampaignStatsBasic> {
		try {
			return await this.dashboardPort.getCampaignStatsBasic(request);
		} catch (error) {
			console.error("Error fetching campaign stats basic:", error);
			throw error;
		}
	}
}
