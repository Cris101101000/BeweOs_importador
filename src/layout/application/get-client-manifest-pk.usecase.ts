import type { IClientManifestPort } from "../domain/ports/client-manifest.port";

export class GetClientManifestPkUseCase {
	constructor(private readonly clientManifestPort: IClientManifestPort) {}

	async execute(): Promise<string | null> {
		return await this.clientManifestPort.getClientManifestPk();
	}
}
