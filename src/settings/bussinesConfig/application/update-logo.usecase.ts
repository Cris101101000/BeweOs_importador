import type { IBusinessInformationPort } from "../domain/ports/business-information.port";

export class UpdateLogoUseCase {
	constructor(
		private readonly businessInformationPort: IBusinessInformationPort
	) {}

	async execute(logo: string): Promise<void> {
		return this.businessInformationPort.updateBusinessInformation({
			brandConfig: { logo },
		});
	}
}
