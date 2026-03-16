/**
 * Utilities for formatting phone numbers
 */

/**
 * Format phone number with spaces for better readability
 * @param number - The phone number string to format
 * @returns Formatted phone number with appropriate spacing
 *
 * @example
 * formatPhoneNumber("3013437122") // Returns "301 343 7122"
 * formatPhoneNumber("3437122")   // Returns "343 7122"
 * formatPhoneNumber("123")       // Returns "123" (unchanged for non-standard lengths)
 */
export const formatPhoneNumber = (number: string): string => {
	// Format number like: 301 343 7122 for 10-digit numbers
	if (number.length === 10) {
		return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
	}

	// Format number like: 343 7122 for 7-digit numbers
	if (number.length === 7) {
		return `${number.slice(0, 3)} ${number.slice(3)}`;
	}

	// Return as-is if not standard length
	return number;
};

/**
 * Format complete phone number with country code and formatted number
 * @param countryCode - Country code (e.g., "+57")
 * @param number - Phone number to format
 * @returns Complete formatted phone number
 *
 * @example
 * formatCompletePhoneNumber("+57", "3013437122") // Returns "+57 301 343 7122"
 */
export const formatCompletePhoneNumber = (
	countryCode: string,
	number: string
): string => {
	return `${countryCode} ${formatPhoneNumber(number)}`;
};

/**
 * Initiates a phone call to the given number.
 *
 * @param {string} phoneNumber - The full phone number to call (including country code).
 * @returns {boolean} True if the call was successfully initiated, false otherwise.
 */
export const initiatePhoneCall = (phoneNumber: string): boolean => {
	try {
		if (typeof window !== "undefined") {
			window.location.href = `tel:${phoneNumber.replace(/\s/g, "")}`;
			return true;
		}
	} catch (error) {
		console.error("Error initiating phone call:", error);
	}
	return false;
};
