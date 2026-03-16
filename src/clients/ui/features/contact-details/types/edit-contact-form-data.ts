import type { DateValue } from "@beweco/aurora-ui";
import { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { EnumGender } from "@shared/domain/enums";
import { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";
import {
	convertDateToDateValue,
	convertStringToDateValue,
} from "@shared/utils/aurora-date.utils";

export interface EditContactFormData {
	firstName: string;
	lastName: string;
	address: string;
	status: EnumClientStatus;
	phones: IPhone[];
	email: string;
	birthdate: DateValue | null;
	gender: EnumGender | null;
	createdChannel: EnumCreationChannel;
}

/**
 * Builds EditContactFormData from a client (e.g. for merging when saving only phones).
 */
export function clientToEditContactFormData(client: IClient): EditContactFormData {
	const getBirthdate = (): DateValue | null => {
		const value = client.birthdate;
		if (!value) return null;
		if (value.includes("/")) {
			return convertStringToDateValue(value) ?? null;
		}
		try {
			return convertDateToDateValue(new Date(value)) ?? null;
		} catch {
			return null;
		}
	};
	const addressStr =
		client.formattedAddress ||
		(client.address
			? [client.address.address, client.address.city, client.address.zip, client.address.country]
					.filter(Boolean)
					.join(", ")
			: "");

	return {
		firstName: client.firstName ?? "",
		lastName: client.lastName ?? "",
		address: addressStr,
		status: (client.status?.translationKey as EnumClientStatus) || EnumClientStatus.CLIENT,
		phones: client.phones ?? [],
		email: client.email ?? "",
		birthdate: getBirthdate(),
		gender: client.gender ?? null,
		createdChannel: client.createdChannel ?? EnumCreationChannel.Web,
	};
}
