import type { IPhoneContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { UpdatePhonesDto } from "../dto/update-phones.dto";

export const mapUpdatePhonesToDto = (
	phones: IPhoneContact[]
): UpdatePhonesDto => {
	return {
		contactInfo: {
			phones: phones.map((phone) => ({
				code: phone.code,
				country: phone.country || "CO",
				number: phone.number,
				type: phone.type,
				isVisible: phone.isVisible,
				channels: phone.channels || ["phone"],
			})),
		},
	};
};
