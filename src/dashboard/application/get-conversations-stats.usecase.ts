import type {
	IConversationsStats,
	IGetConversationsStatsRequest,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetConversationsStatsUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(
		request?: IGetConversationsStatsRequest
	): Promise<IConversationsStats> {
		try {
			return await this.dashboardPort.getConversationsStats(request);
		} catch (error) {
			console.error("Error fetching conversations stats:", error);
			throw error;
		}
	}
}
