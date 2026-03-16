import type { IBusinessInformation } from "../domain/interfaces/business-information.interface";
import type { IBusinessInformationPort } from "../domain/ports/business-information.port";

interface UpdateBusinessInformationUseCaseProps {
	name: string;
	taxId: string;
	sector: string;
	idCompany: string;
}

export class UpdateBusinessInformationUseCase {
	constructor(
		private readonly businessInformationPort: IBusinessInformationPort
	) {}

	async execute({
		name,
		taxId,
		sector,
	}: UpdateBusinessInformationUseCaseProps): Promise<void> {
		// Only modified fields (sparse payload for PUT companies/me)
		const payload = {
			basicInfo: { name },
			businessInfo: {
				vertical: sector,
				taxInfo: { nit: taxId },
			},
		} as Partial<IBusinessInformation>;

		return this.businessInformationPort.updateBusinessInformation(payload);
	}
}
