import type { ICommunication } from "@clients/domain/interfaces/communication.interface";
import type { IClientHistoryPort } from "@clients/domain/ports/client-history.port";

export class GetClientCommunicationsUseCase {
	constructor(private readonly clientHistoryPort: IClientHistoryPort) {}

	async execute(clientId: string): Promise<ICommunication[]> {
		if (!clientId || clientId.trim() === "") {
			throw new Error("Client ID is required");
		}

		return await this.clientHistoryPort.getCommunicationsByClientId(clientId);
	}
}
