import type { IBusinessInformationPort } from "../domain/ports/business-information.port";

interface UpdateBrandProfileProps {
	businessName: string;
}

export class UpdateBrandProfileUseCase {
	constructor(
		private readonly businessInformationPort: IBusinessInformationPort
	) {}

	async execute({ businessName }: UpdateBrandProfileProps): Promise<void> {
		await this.businessInformationPort.updateBusinessInformation({
			basicInfo: { name: businessName },
		});
	}
}
