import type { IBusinessInformation } from "../domain/interfaces/business-information.interface";
import type { IBusinessInformationPort } from "../domain/ports/business-information.port";

export class GetBusinessInformationUseCase {
	constructor(private readonly port: IBusinessInformationPort) {}

	async execute(): Promise<IBusinessInformation> {
		return this.port.getBusinessInformation();
	}
}
