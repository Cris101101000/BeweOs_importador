import type { IIntegration, IIntegrationPort } from "../domain";

export class GetIntegrationsUseCase {
	constructor(private readonly integrationPort: IIntegrationPort) {}

	async execute(): Promise<IIntegration[]> {
		try {
			const integrations = await this.integrationPort.getIntegrations();
			return integrations;
		} catch (error) {
			console.error("Error fetching integrations:", error);
			throw new Error("Failed to fetch integrations");
		}
	}
}
