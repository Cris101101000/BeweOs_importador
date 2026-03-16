import type { ContactType } from "@settings/bussinesConfig/domain/enums/contact-type.enum";

export interface UpdatePhonesDto {
	contactInfo: {
		phones: IPhoneDto[];
	};
}

export interface IPhoneDto {
	code: string;
	country: string;
	number: string;
	type: ContactType;
	isVisible: boolean;
	channels: ("phone" | "whatsapp")[];
}
