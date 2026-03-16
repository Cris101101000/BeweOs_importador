import type { IAgency } from "../../domain/interfaces/agency.interface";
import type { DtoGetUserData } from "../dtos/get-init-user.dto";

export const mapDtoToAgency = (dto: DtoGetUserData["agency"]): IAgency => {
	return {
		id: dto.id,
		name: dto.name,
		logo: dto.logo,
		configurations: {
			primaryColor: dto.configuration.primaryColor[0],
			secondaryColor: dto.configuration.secondaryColor[0],
		},
		// Extended fields from API
		type: dto.type,
		state: dto.state,
		country: dto.country,
		language: dto.language,
		currency: dto.currency,
		timezone: dto.timezone,
		terms: dto.terms,
		policies: dto.policies,
		description: dto.description,
		urlGoogleBusiness: dto.urlGoogleBusiness,
		webPage: dto.webPage,
		phones: dto.phones,
		createdAt: dto.createdAt,
		updatedAt: dto.updatedAt,
		createdBy: dto.createdBy,
		brandConfig: dto.brandConfig,
	};
};
