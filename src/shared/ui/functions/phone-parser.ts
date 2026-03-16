import type { IPhoneContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";

// This is a simplified parser. A more robust solution should be implemented.
export const parsePhoneNumber = (
	phoneNumber: string
): Partial<IPhoneContact> => {
	// Find the first occurrence of a digit, which marks the start of the number.
	const numberStartIndex = phoneNumber.search(/\d/);

	if (numberStartIndex === -1) {
		// No digits found, return empty object.
		return {};
	}

	const code = phoneNumber.substring(0, numberStartIndex).trim();
	const number = phoneNumber.substring(numberStartIndex).trim();

	// A simple heuristic to guess the country code might not be accurate.
	// For now, we will leave the country property empty.
	return {
		code,
		number,
		channels: ["phone", "whatsapp"] as ("phone" | "whatsapp")[],
	};
};
