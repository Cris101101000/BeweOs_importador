import type {
	IContactsStats,
	IGetContactsStatsRequest,
} from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetContactsStatsUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(request: IGetContactsStatsRequest): Promise<IContactsStats> {
		try {
			return await this.dashboardPort.getContactsStats(request);
		} catch (error) {
			console.error("Error fetching contacts stats:", error);
			throw error;
		}
	}
}
