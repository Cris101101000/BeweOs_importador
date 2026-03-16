import type {
	IAddress,
	IBusinessInformation,
} from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { IBusinessInformationPort } from "@settings/bussinesConfig/domain/ports/business-information.port";

/**
 * Use case for updating the physical address of a business.
 * Sends only the address fields to update (sparse payload).
 */
export class UpdateAddressUseCase {
	constructor(
		private readonly businessInformationPort: IBusinessInformationPort
	) {}

	/**
	 * Executes the use case to update the physical address.
	 * @param _idCompany - The ID of the company to update.
	 * @param address - A partial address object with the fields to update.
	 */
	async execute(_idCompany: string, address: Partial<IAddress>): Promise<void> {
		const addressPayload: Partial<IAddress> = {};
		if (address.address !== undefined) addressPayload.address = address.address;
		if (address.urlGoogleMaps !== undefined) addressPayload.urlGoogleMaps = address.urlGoogleMaps;
		if (address.country !== undefined) addressPayload.country = address.country;
		if (address.city !== undefined) addressPayload.city = address.city;
		if (address.zip !== undefined) addressPayload.zip = address.zip;

		if (Object.keys(addressPayload).length === 0) {
			return;
		}

		await this.businessInformationPort.updateBusinessInformation({
			contactInfo: { address: addressPayload },
		});
	}
}
