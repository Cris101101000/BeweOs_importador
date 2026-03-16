import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { IUpdateBusinessInformationDto } from "../dto/update-business-information.dto";

/**
 * Builds a DTO with only the fields present in the input (sparse payload).
 * Used so PUT companies/me sends only modified fields.
 */
export const toUpdateBusinessInformationDto = (
	data: Partial<IBusinessInformation>
): IUpdateBusinessInformationDto => {
	const {
		basicInfo,
		brandConfig,
		contactInfo,
		businessInfo,
		systemConfiguration,
	} = data;

	const dto: IUpdateBusinessInformationDto = {};

	if (basicInfo) {
		dto.basicInfo = {};
		if (basicInfo.name !== undefined) {
			dto.basicInfo.name = basicInfo.name;
		}
		if (basicInfo.webDomain !== undefined) {
			dto.basicInfo.webDomain = basicInfo.webDomain;
		}
		if (Object.keys(dto.basicInfo).length === 0) {
			delete dto.basicInfo;
		}
	}

	if (businessInfo) {
		dto.businessInfo = {};
		if (businessInfo.taxInfo?.nit !== undefined) {
			dto.businessInfo.taxInfo = { nit: businessInfo.taxInfo.nit };
		}
		if (businessInfo.vertical !== undefined) {
			dto.businessInfo.vertical = businessInfo.vertical;
		}
		if (Object.keys(dto.businessInfo).length === 0) {
			delete dto.businessInfo;
		}
	}

	if (systemConfiguration) {
		dto.systemConfiguration = {};
		if (systemConfiguration.terms !== undefined) {
			dto.systemConfiguration.terms = systemConfiguration.terms;
		}
		if (typeof businessInfo?.currency === "object" && businessInfo.currency?.code !== undefined) {
			dto.systemConfiguration.currency = businessInfo.currency.code;
		}
		if (Object.keys(dto.systemConfiguration).length === 0) {
			delete dto.systemConfiguration;
		}
	}

	if (contactInfo) {
		dto.contactInfo = {};
		if (contactInfo.phones !== undefined) {
			dto.contactInfo.phones = contactInfo.phones.map((phone) => ({
				code: phone.code,
				country: phone.country,
				number: phone.number,
				type: phone.type,
				isVisible: phone.isVisible,
				channels: phone.channels,
			}));
		}
		if (contactInfo.emails !== undefined) {
			dto.contactInfo.emails = contactInfo.emails.map((email) => {
				const mapped: {
					email: string;
					type: string;
					isVisible: boolean;
					createdBy?: string;
				} = {
					email: email.email,
					type: email.type,
					isVisible: email.isVisible,
				};
				if (email.createdBy) {
					mapped.createdBy = email.createdBy;
				}
				return mapped;
			});
		}
		if (contactInfo.address !== undefined) {
			const addr = contactInfo.address;
			const hasAny =
				addr.address !== undefined ||
				addr.urlGoogleMaps !== undefined ||
				addr.country !== undefined ||
				addr.city !== undefined ||
				addr.zip !== undefined;
			if (hasAny) {
				dto.contactInfo.address = {};
				if (addr.address !== undefined) {
					dto.contactInfo.address.address = addr.address;
				}
				if (addr.urlGoogleMaps !== undefined) {
					dto.contactInfo.address.urlGoogleMaps = addr.urlGoogleMaps;
				}
				if (addr.country !== undefined) {
					dto.contactInfo.address.country = addr.country;
				}
				if (addr.city !== undefined) {
					dto.contactInfo.address.city = addr.city;
				}
				if (addr.zip !== undefined) {
					dto.contactInfo.address.zip = addr.zip;
				}
			}
		}
		if (contactInfo.socialNetwork !== undefined) {
			dto.contactInfo.socialNetwork = {
				instagram: contactInfo.socialNetwork.instagram,
				facebook: contactInfo.socialNetwork.facebook,
				tiktok: contactInfo.socialNetwork.tiktok,
				twitter: contactInfo.socialNetwork.twitter,
				linkedin: contactInfo.socialNetwork.linkedin,
				youtube: contactInfo.socialNetwork.youtube,
			};
		}
		if (Object.keys(dto.contactInfo).length === 0) {
			delete dto.contactInfo;
		}
	}

	if (brandConfig) {
		dto.brandConfig = {};
		if (brandConfig.brandName !== undefined) {
			dto.brandConfig.brandName = brandConfig.brandName;
		}
		if (brandConfig.logo !== undefined) {
			dto.brandConfig.logo = brandConfig.logo;
		}
		if (brandConfig.favicon !== undefined) {
			dto.brandConfig.favicon = brandConfig.favicon;
		}
		if (brandConfig.description !== undefined) {
			dto.brandConfig.description = brandConfig.description;
			dto.description = brandConfig.description;
		}
		if (brandConfig.slogan !== undefined) {
			dto.brandConfig.slogan = brandConfig.slogan;
		}
		if (Object.keys(dto.brandConfig).length === 0) {
			delete dto.brandConfig;
		}
	}

	return dto;
};
