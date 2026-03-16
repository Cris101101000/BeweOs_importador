import type { IBusinessInformation } from "../interfaces/business-information.interface";

export interface IBusinessInformationPort {
	getBusinessInformation(): Promise<IBusinessInformation>;
	updateBusinessInformation(data: Partial<IBusinessInformation>): Promise<void>;
}
