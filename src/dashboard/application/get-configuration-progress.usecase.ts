import type { IConfigurationProgress } from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetConfigurationProgressUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(): Promise<IConfigurationProgress> {
		try {
			return await this.dashboardPort.getConfigurationProgress();
		} catch (error) {
			console.error("Error fetching configuration progress:", error);
			throw error;
		}
	}
}
