import type { IPhoneContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";

export interface PhonesPort {
	update(idCompany: string, phones: IPhoneContact[]): Promise<void>;
}
