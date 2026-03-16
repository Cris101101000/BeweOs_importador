import { PROSPECTIVE_CLIENT } from "@clients/domain/constants/prospective-client.constants";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { IPotential } from "@clients/domain/interfaces/potential.interface";
import type { IStatus } from "@clients/domain/interfaces/status.interface";
import { toAiTagsFromDtos } from "@clients/infrastructure/mappers/ai-tag.mapper";
import type { EnumGender } from "@shared/domain/enums";
import type { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";
import type { PhoneDto } from "@shared/infrastructure/dtos/phone.dto";
import type { IAddress } from "@clients/domain/interfaces/address.interface";
import type { GetClientResponseDto } from "../dtos/get-client.dto";

/**
 * Maps status string to IStatus object using STATUS_CLIENT constants
 */
const mapStatus = (statusValue?: string): IStatus => {
	const normalizedStatus =
		statusValue?.toLowerCase() as keyof typeof STATUS_CLIENT;

	if (normalizedStatus && normalizedStatus in STATUS_CLIENT) {
		return {
			translationKey: normalizedStatus as unknown as EnumClientStatus,
			value: STATUS_CLIENT[normalizedStatus].value,
			color: STATUS_CLIENT[normalizedStatus].color,
		};
	}

	return {
		translationKey: EnumClientStatus.PROSPECT,
		value: EnumClientStatus.PROSPECT,
		color: STATUS_CLIENT.prospect.color,
	};
};

/**
 * Maps potential string to IPotential object using PROSPECTIVE_CLIENT constants
 */
const mapPotential = (potentialValue?: string): IPotential | undefined => {
	if (!potentialValue) return undefined;

	const normalizedPotential =
		potentialValue.toLowerCase() as keyof typeof PROSPECTIVE_CLIENT;

	if (normalizedPotential in PROSPECTIVE_CLIENT) {
		return {
			translationKey: PROSPECTIVE_CLIENT[normalizedPotential].translationKey,
			color: PROSPECTIVE_CLIENT[normalizedPotential].color,
		};
	}

	return undefined;
};


/**
 * Valid phone channels
 */
const VALID_CHANNELS = ["phone", "whatsapp"] as const;

/**
 * Maps PhoneDto to IPhone domain object
 * Ensures channels are properly typed
 */
const mapPhoneToIPhone = (phoneDto: PhoneDto): IPhone => {
	const channels = phoneDto.channels?.filter(
		(channel): channel is "phone" | "whatsapp" =>
			VALID_CHANNELS.includes(channel as "phone" | "whatsapp")
	);

	return {
		code: phoneDto.code,
		country: phoneDto.country,
		number: phoneDto.number,
		type: phoneDto.type,
		isVisible: phoneDto.isVisible,
		...(channels && channels.length > 0 && { channels }),
	};
};

/**
 * Maps array of PhoneDto to IPhone[]
 */
const mapPhones = (phones?: PhoneDto[]): IPhone[] => {
	if (!phones) return [];
	return phones.map(mapPhoneToIPhone);
};

/**
 * Maps AddressDto to IAddress domain object
 */
const mapAddress = (dto?: GetClientResponseDto["address"]): IAddress | undefined => {
	if (!dto) return undefined;
	return {
		...(dto.address && { address: dto.address }),
		...(dto.urlGoogleMaps != null && { urlGoogleMaps: dto.urlGoogleMaps }),
		...(dto.country && { country: dto.country }),
		...(dto.city && { city: dto.city }),
		...(dto.zip && { zip: dto.zip }),
		...(dto.createdAt && { createdAt: String(dto.createdAt) }),
		...(dto.updatedAt && { updatedAt: String(dto.updatedAt) }),
	};
};

/**
 * Maps GetClientResponseDto to IClient domain object
 * Handles tags from the DTO
 *
 * Maps firstName and lastName directly from the API response
 */
export const toClientFromResponse = (
	responseDto: GetClientResponseDto
): IClient => {
	const {
		id,
		phones,
		email,
		createdBy,
		birthdate,
		status,
		tags,
		creationChannel,
		potentialTier,
		lastCommunication,
		createdAt,
		updatedAt,
		isActive,
		gender,
		firstname,
		lastname,
		address,
		formattedAddress,
	} = responseDto;

	// Map direct tags from DTO using AI tag mapper
	const directTags: IAiTag[] = tags ? toAiTagsFromDtos(tags) : [];

	return {
		...(id && { id }),
		firstName: firstname || "",
		lastName: lastname || "",
		email: email || "",
		phones: mapPhones(phones),
		status: mapStatus(status),
		tags: directTags,
		...(createdBy && { createdBy }),
		...(birthdate && { birthdate }),
		...(creationChannel && {
			createdChannel: creationChannel as EnumCreationChannel,
		}),
		...(potentialTier && { potential: mapPotential(potentialTier) }),
		...(lastCommunication && { lastCommunication }),
		...(createdAt && { createdAt }),
		...(updatedAt && { updatedAt }),
		...(isActive !== undefined && { isActive }),
		...(gender && { gender: gender as EnumGender }),
		...(address && { address: mapAddress(address) }),
		...(formattedAddress !== undefined && formattedAddress !== "" && { formattedAddress }),
	};
};
