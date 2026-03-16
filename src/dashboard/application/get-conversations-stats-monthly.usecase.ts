import type {
	IConversationsStatsMonthly,
	IGetConversationsStatsMonthlyRequest,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetConversationsStatsMonthlyUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(
		request?: IGetConversationsStatsMonthlyRequest
	): Promise<IConversationsStatsMonthly> {
		try {
			return await this.dashboardPort.getConversationsStatsMonthly(request);
		} catch (error) {
			console.error("Error fetching conversations stats monthly:", error);
			throw error;
		}
	}
}
