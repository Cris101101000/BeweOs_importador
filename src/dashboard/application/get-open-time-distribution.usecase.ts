import type {
	IGetOpenTimeDistributionRequest,
	IOpenTimeDistribution,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetOpenTimeDistributionUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(
		request?: IGetOpenTimeDistributionRequest
	): Promise<IOpenTimeDistribution> {
		try {
			return await this.dashboardPort.getOpenTimeDistribution(request);
		} catch (error) {
			console.error("Error fetching open time distribution:", error);
			throw error;
		}
	}
}
