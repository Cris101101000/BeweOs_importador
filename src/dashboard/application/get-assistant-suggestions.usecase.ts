import type { IAssistantSuggestionAlert } from "../domain/interfaces/dashboard.interface";
import type { IDashboardPort } from "../domain/ports/dashboard.port";

export class GetAssistantSuggestionsUseCase {
	constructor(private dashboardPort: IDashboardPort) {}

	async execute(): Promise<IAssistantSuggestionAlert[]> {
		try {
			return await this.dashboardPort.getAssistantSuggestions();
		} catch (error) {
			console.error("Error fetching assistant suggestions:", error);
			throw error;
		}
	}
}