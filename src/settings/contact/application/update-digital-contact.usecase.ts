import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { IBusinessInformationPort } from "@settings/bussinesConfig/domain/ports/business-information.port";
import type { IDigitalContact } from "../domain/interfaces/digital-contact.interface";

/**
 * Use case for updating digital contact information (emails and website)
 *
 * This use case follows the Clean Architecture pattern by:
 * - Depending on abstractions (IBusinessInformationPort)
 * - Handling the business logic for digital contact updates
 * - Reusing the existing business information infrastructure
 */
export class UpdateDigitalContactUseCase {
	constructor(
		private readonly businessInformationPort: IBusinessInformationPort
	) {}

	/**
	 * Executes the digital contact update operation
	 *
	 * @param digitalContact - The digital contact data to update (emails and website)
	 * @throws {Error} When the update operation fails
	 */
	async execute(digitalContact: IDigitalContact): Promise<void> {
		const businessInformationUpdate: Partial<IBusinessInformation> = {
			contactInfo: {
				emails: digitalContact.emails,
			},
		};

		// Only include basicInfo.webDomain when website is provided (no name to avoid overwriting)
		if (digitalContact.website !== undefined) {
			businessInformationUpdate.basicInfo = {
				webDomain: digitalContact.website,
			};
		}

		await this.businessInformationPort.updateBusinessInformation(
			businessInformationUpdate
		);
	}
}
