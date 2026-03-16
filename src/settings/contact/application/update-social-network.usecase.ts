import type {
	IBusinessInformation,
	ISocialNetwork,
} from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { IBusinessInformationPort } from "@settings/bussinesConfig/domain/ports/business-information.port";

/**
 * Use case for updating social network information of a business
 *
 * This use case follows the Clean Architecture pattern by:
 * - Depending on abstractions (IBusinessInformationPort)
 * - Handling the business logic for social network updates
 * - Sending only social network data to be updated (backend preserves other fields)
 */
export class UpdateSocialNetworkUseCase {
	constructor(
		private readonly businessInformationPort: IBusinessInformationPort
	) {}

	/**
	 * Executes the social network update operation
	 *
	 * @param socialNetwork - The social network data to update (only changed fields)
	 * @throws {Error} When the update operation fails
	 */
	async execute(socialNetwork: ISocialNetwork): Promise<void> {
		// Create partial update with only social network changes
		const businessInformationUpdate: Partial<IBusinessInformation> = {
			contactInfo: {
				socialNetwork: {
					instagram: socialNetwork.instagram,
					facebook: socialNetwork.facebook,
					tiktok: socialNetwork.tiktok,
					twitter: socialNetwork.twitter,
					linkedin: socialNetwork.linkedin,
					youtube: socialNetwork.youtube,
				},
			},
		};

		await this.businessInformationPort.updateBusinessInformation(
			businessInformationUpdate
		);
	}
}
