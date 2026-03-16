import type { IClientPort } from "../domain/ports/client.port";

export class DeleteClientUseCase {
	constructor(private readonly clientPort: IClientPort) {}

	async execute(clientId: string): Promise<void> {
		return await this.clientPort.deleteClient(clientId);
	}
}
