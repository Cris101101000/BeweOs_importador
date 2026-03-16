import type { IAddress } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { IBusinessInformationPort } from "@settings/bussinesConfig/domain/ports/business-information.port";

export class UpdateAddressUseCase {
	constructor(private readonly locationPort: IBusinessInformationPort) {}

	async execute(idCompany: string, address: Partial<IAddress>): Promise<void> {
		const data = {
			contactInfo: {
				address: {
					...address,
				},
			},
		};
		await this.locationPort.updateBusinessInformation(data);
	}
}
