import { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type {
	IClient,
	IFastClient,
} from "@clients/domain/interfaces/client.interface";
import { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";

/**
 * Transform quick contact data to client domain model
 */
export const transformFastClientToClient = ({
	firstName,
	lastName,
	email,
	phone,
}: IFastClient): IClient => {
	return {
		firstName,
		lastName,
		email,
		phones: [phone],
		status: {
			translationKey: EnumClientStatus.LEAD,
			value: EnumClientStatus.LEAD,
			color: "blue",
		},
		createdChannel: EnumCreationChannel.Web,
	};
};
