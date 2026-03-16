import type { IUpdateCommunicationRequest } from "@clients/domain/interfaces/communication.interface";
import type { IClientHistoryPort } from "@clients/domain/ports/client-history.port";

export class UpdateCommunicationUseCase {
	constructor(private readonly clientHistoryPort: IClientHistoryPort) {}

	async execute(
		communicationId: string,
		clientId: string,
		updates: IUpdateCommunicationRequest
	): Promise<void> {
		await this.clientHistoryPort.updateCommunication(
			communicationId,
			clientId,
			updates
		);
	}
}
