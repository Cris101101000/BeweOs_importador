import type { IClient } from "../domain/interfaces/client.interface";
import type { IClientPort } from "../domain/ports/client.port";

export class GetClientByIdUseCase {
	constructor(private readonly clientPort: IClientPort) {}

	async execute(clientId: string): Promise<IClient> {
		if (!clientId) {
			throw new Error("Client ID is required");
		}

		return await this.clientPort.getClientById(clientId);
	}
}
