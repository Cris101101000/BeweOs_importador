import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";

export interface BusinessInformationPageProps {
	businessInformation: IBusinessInformation | null;
	onDataUpdated?: () => void;
}
