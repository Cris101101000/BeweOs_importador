import type { IPhone } from "@shared/domain/interfaces/phone.interface";
import type { PhoneDto } from "@shared/infrastructure/dtos/phone.dto";

/**
 * Maps domain phone objects to API DTO format
 * Ensures each phone includes required default fields for the API schema
 */
const defaultChannels = ["phone"] as const;

export const toPhoneDtos = (phones: IPhone[]): PhoneDto[] => {
	return phones.map(
		(p): PhoneDto => ({
			code: p.code,
			country: p.country,
			number: p.number,
			type: p.type ?? "main",
			isVisible: p.isVisible ?? true,
			channels: (p.channels?.length ? p.channels : defaultChannels) as string[],
		})
	);
};

/**
 * Maps a single domain phone object to API DTO format
 */
export const toPhoneDto = (phone: IPhone): PhoneDto => {
	return {
		code: phone.code,
		country: phone.country,
		number: phone.number,
		type: phone.type ?? "main",
		isVisible: phone.isVisible ?? true,
		channels: (phone.channels?.length ? phone.channels : defaultChannels) as string[],
	};
};
