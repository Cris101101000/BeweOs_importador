import type { ContactType } from "@settings/bussinesConfig/domain/enums/contact-type.enum";
import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { GetBusinessInformationResponseDto } from "../dto/get-business-information.dto";
import { mapToCurrency } from "./currency.mapper";
import { mapDtoListToHolidays } from "./holiday.mapper";
import { mapDtoListToSchedules } from "./schedule.mapper";

export const mapDtoToBusinessInformation = (
	dto: GetBusinessInformationResponseDto
): IBusinessInformation => {
	const schedules = mapDtoListToSchedules(dto.schedules || []);
	const holidays = mapDtoListToHolidays(dto.holidays || []);
	return {
		basicInfo: {
			name: dto.basicInfo.name,
			webDomain: dto.basicInfo.webDomain,
		},
		businessInfo: {
			vertical: dto.businessInfo.vertical,
			taxInfo: {
				nit: dto.businessInfo.taxInfo?.nit || "",
			},
			currency: mapToCurrency(dto.businessInfo.currency || ""),
		},
		brandConfig: {
			brandName: dto.brandConfig.brandName,
			logo: dto.brandConfig.logo,
			favicon: dto.brandConfig.favicon,
			description: dto.brandConfig.description,
			slogan: dto.brandConfig.slogan,
			primaryColor: dto.brandConfig.primaryColor,
			secondaryColor: dto.brandConfig.secondaryColor,
		},
		contactInfo: {
			phones: dto.contactInfo.phones.map((phone) => ({
				...phone,
				type: phone.type as ContactType,
			})),
			emails: dto.contactInfo.emails.map((email) => ({
				...email,
				email: email.email || "",
				createdBy: email.createdBy || "",
				type: email.type as ContactType,
			})),
			socialNetwork: {
				...dto.contactInfo.socialNetwork,
			},
			address: {
				...dto.contactInfo.address,
			},
			phonesWhatsapp: dto.contactInfo.phones
				.filter((phone) => phone.channels?.includes("whatsapp"))
				.map((phone) => ({
					...phone,
					type: phone.type as ContactType,
				})),
		},
		schedule: schedules,
		holidays: holidays,
	};
};
