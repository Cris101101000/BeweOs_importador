import { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import type { IClient } from "../domain/interfaces/client.interface";
import type { IClientPort } from "../domain/ports/client.port";

export class CreateClientUseCase {
	constructor(private readonly clientPort: IClientPort) {}

	async execute(clientData: IClient): Promise<IClient> {
		const clientWithDefaults: IClient = {
			...clientData,
			createdChannel: clientData.createdChannel || EnumCreationChannel.Web,
		};

		const client = await this.clientPort.createClient(clientWithDefaults);
		return client;
	}
}
