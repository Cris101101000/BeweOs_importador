import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { IBusinessInformationPort } from "@settings/bussinesConfig/domain/ports/business-information.port";
import { httpService } from "@shared/infrastructure/services/api-http.service";
import type { GetBusinessInformationResponseDto } from "../dto/get-business-information.dto";
import { mapDtoToBusinessInformation } from "../mappers/business-information.mapper";
import { toUpdateBusinessInformationDto } from "../mappers/update-business-information.mapper";

export class BusinessInformationAdapter implements IBusinessInformationPort {
	private cachedData: GetBusinessInformationResponseDto | null = null;

	private async fetchAndCacheData(): Promise<GetBusinessInformationResponseDto> {
		if (this.cachedData) {
			return this.cachedData;
		}

		const response =
			await httpService.get<GetBusinessInformationResponseDto>("companies/me");

		if (response.success && response.data) {
			// this.cachedData = response.data;
			return response.data;
		}
		throw new Error(response.message || "Failed to fetch business information");
	}

	async getBusinessInformation(): Promise<IBusinessInformation> {
		const data = await this.fetchAndCacheData();
		return mapDtoToBusinessInformation(data);
	}

	async updateBusinessInformation(
		data: Partial<IBusinessInformation>
	): Promise<void> {
		const dto = toUpdateBusinessInformationDto(data);

		const response = await httpService.put<void>(`companies/me`, dto);

		if (!response.success) {
			throw new Error(
				response.message || "Failed to update business information"
			);
		}

		this.cachedData = null; // Invalidate cache
	}
}
