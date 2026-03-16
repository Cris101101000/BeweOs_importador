import type {
	ICommunication,
	ICreateCommunicationRequest,
} from "@clients/domain/interfaces/communication.interface";
import type { IClientHistoryPort } from "@clients/domain/ports/client-history.port";

export class CreateCommunicationUseCase {
	constructor(private readonly clientHistoryPort: IClientHistoryPort) {}

	async execute(
		communicationData: ICreateCommunicationRequest
	): Promise<ICommunication> {
		if (
			!communicationData.clientId ||
			communicationData.clientId.trim() === ""
		) {
			throw new Error("Client ID is required");
		}

		return await this.clientHistoryPort.createCommunication(communicationData);
	}
}
