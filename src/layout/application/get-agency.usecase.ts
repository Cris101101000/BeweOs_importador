import type { IAgency } from "../domain/interfaces/agency.interface";
import type { IAgencyPort } from "../domain/ports/agency.port";

export class GetAgencyUseCase {
	constructor(private readonly agencyPort: IAgencyPort) {}

	async execute(): Promise<IAgency | null> {
		return await this.agencyPort.getAgency();
	}
}
