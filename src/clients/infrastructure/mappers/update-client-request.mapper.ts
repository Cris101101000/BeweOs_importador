import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import {
	formatDateToISO,
	isValidDateString,
} from "@shared/utils/date-formatter.utils";
import type { GetClientResponseDto } from "../dtos/get-client.dto";
import { toPhoneDtos } from "./phone.mapper";

/**
 * Maps domain partial client updates to a partial response/request DTO
 * used for PATCH/PUT operations against the API.
 *
 * Notes:
 * - `status` in domain can be IStatus or EnumClientStatus; API expects string
 * - Phones array is passed through as-is, since DTO shares the same shape
 */
export const toUpdateClientRequestDto = (
	updates: Partial<IClient>
): Partial<GetClientResponseDto> => {
	const dto: Partial<GetClientResponseDto> = {};

	if (typeof updates.email === "string") {
		dto.email = updates.email;
	}

	if (Array.isArray(updates.phones)) {
		// Map phones with required API schema fields using shared mapper
		dto.phones = toPhoneDtos(updates.phones);
	}

	if (updates.status) {
		dto.status =
			typeof updates.status === "string"
				? (updates.status as EnumClientStatus)
				: updates.status.translationKey;
	}

	if (typeof updates.firstName === "string") {
		dto.firstname = updates.firstName;
	}
	if (typeof updates.lastName === "string") {
		dto.lastname = updates.lastName;
	}
	if (typeof updates.formattedAddress === "string") {
		dto.formattedAddress = updates.formattedAddress;
	}
	if (updates.address) {
		dto.address = {
			...updates.address,
		};
	}

	if (typeof updates.birthdate === "string") {
		const trimmedBirthdate = updates.birthdate.trim();
		if (trimmedBirthdate.length > 0) {
			// Accept either "dd/MM/yyyy" (convert to "yyyy-MM-dd") or already ISO
			const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
			const normalizedBirthdate = isValidDateString(trimmedBirthdate)
				? formatDateToISO(trimmedBirthdate)
				: ISO_DATE_REGEX.test(trimmedBirthdate)
					? trimmedBirthdate
					: "";
			if (normalizedBirthdate) {
				dto.birthdate = normalizedBirthdate;
			}
		}
	}

	if (updates.gender) {
		dto.gender = updates.gender as string;
	}

	if (updates.createdChannel) {
		dto.creationChannel =
			updates.createdChannel as unknown as EnumCreationChannel;
	}

	return dto;
};
