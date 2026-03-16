import type { IPhoneContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { PhonesPort } from "../domain/ports/phones.port";

export class UpdatePhonesUseCase {
	constructor(private readonly phonesPort: PhonesPort) {}

	async execute(idCompany: string, phones: IPhoneContact[]): Promise<void> {
		await this.phonesPort.update(idCompany, phones);
	}
}
