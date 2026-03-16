import type {
	IAiTagsStats,
	IGetTagsStatsRequest,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetTagsStatsUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(request: IGetTagsStatsRequest): Promise<IAiTagsStats> {
		try {
			return await this.dashboardPort.getTagsStats(request);
		} catch (error) {
			console.error("Error fetching tags stats:", error);
			throw error;
		}
	}
}
