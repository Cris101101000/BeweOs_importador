import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { IBusinessInformationPort } from "@settings/bussinesConfig/domain/ports/business-information.port";
import { mapDtoToBusinessInformation } from "@settings/bussinesConfig/infrastructure/mappers/business-information.mapper";
import { toUpdateBusinessInformationDto } from "@settings/bussinesConfig/infrastructure/mappers/update-business-information.mapper";
import type { GetBusinessInformationResponseDto } from "@settings/bussinesConfig/infrastructure/dto/get-business-information.dto";
import { httpService } from "@shared/infrastructure/services/api-http.service";

export class CompanyOnboardingAdapter implements IBusinessInformationPort {
	async getBusinessInformation(): Promise<IBusinessInformation> {
		const response =
			await httpService.get<GetBusinessInformationResponseDto>("companies/me");

		if (response.success && response.data) {
			return mapDtoToBusinessInformation(response.data);
		}

		throw new Error(response.message || "Failed to fetch onboarding company information");
	}

	async updateBusinessInformation(
		data: Partial<IBusinessInformation>,
	): Promise<void> {
		const dto = toUpdateBusinessInformationDto(data);
		
		const response = await httpService.put<void>(
			"companies/me/onboarding",
			dto,
		);

		if (!response.success) {
			throw new Error(
				response.message || "Failed to update onboarding company information",
			);
		}
	}
}
