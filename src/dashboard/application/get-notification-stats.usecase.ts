import type {
	IGetNotificationStatsRequest,
	INotificationStats,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetNotificationStatsUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(
		request?: IGetNotificationStatsRequest
	): Promise<INotificationStats> {
		try {
			return await this.dashboardPort.getNotificationStats(request);
		} catch (error) {
			console.error("Error fetching notification stats:", error);
			throw error;
		}
	}
}
