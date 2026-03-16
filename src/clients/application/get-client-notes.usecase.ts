import type {
	IClientHistoryPort,
	IClientNotesOptions,
	IClientNotesResult,
} from "@clients/domain/ports/client-history.port";

export class GetClientNotesUseCase {
	constructor(private readonly clientHistoryPort: IClientHistoryPort) {}

	async execute(
		clientId: string,
		options?: IClientNotesOptions
	): Promise<IClientNotesResult> {
		if (!clientId || clientId.trim() === "") {
			throw new Error("Client ID is required");
		}

		return await this.clientHistoryPort.getNotesByClientId(clientId, options);
	}
}
