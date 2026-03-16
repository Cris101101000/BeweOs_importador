import type { IPhoneContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { PhonesPort } from "@settings/contact/domain/ports/phones.port";
import { mapUpdatePhonesToDto } from "@settings/contact/infrastructure/mappers/update-phones.mapper";
import { httpService } from "@shared/infrastructure/services/api-http.service";

export class PhonesAdapter implements PhonesPort {
	async update(_idCompany: string, phones: IPhoneContact[]): Promise<void> {
		const dto = mapUpdatePhonesToDto(phones);

		const response = await httpService.put<void>("companies/me", dto);

		if (!response.success) {
			throw new Error(response.message || "Failed to update phones");
		}
	}
}
