import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";

export interface IBusinessInformationForm {
	name: string;
	taxId: string;
	sector: string;
}

export interface BusinessInformationFormProps {
	initialData: IBusinessInformation | null;
	onDataUpdated?: () => void;
}
