import type { IClient } from "../domain/interfaces/client.interface";
import type { IClientPort } from "../domain/ports/client.port";

export class UpdateClientUseCase {
	constructor(private readonly clientPort: IClientPort) {}

	async execute(clientId: string, updates: Partial<IClient>): Promise<IClient> {
		if (!clientId) {
			throw new Error("Client ID is required");
		}
		return await this.clientPort.updateClient(clientId, updates);
	}
}
