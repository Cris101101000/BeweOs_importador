/**
 * Utility functions for WhatsApp integration.
 */

/**
 * Opens a WhatsApp chat in a new tab.
 *
 * This function constructs a `wa.me` link and opens it in a new browser tab.
 * It removes all non-digit characters from the phone number to ensure the link is valid.
 *
 * @param {string} phoneNumber - The phone number to open a chat with, including the country code.
 * @param {string} [message] - An optional predefined message to include in the chat.
 * @returns {boolean} True if the redirect was attempted, false otherwise.
 *
 * @example
 * // Opens a chat with +1234567890
 * redirectToWhatsApp("+1 (234) 567-890");
 *
 * // Opens a chat with a predefined message
 * redirectToWhatsApp("+1234567890", "Hello there!");
 */
export const redirectToWhatsApp = (
	phoneNumber: string,
	message?: string
): boolean => {
	if (!phoneNumber) {
		console.error("WhatsApp redirect failed: phone number is required.");
		return false;
	}

	try {
		// Remove all non-digit characters from the phone number
		const formattedNumber = phoneNumber.replace(/\D/g, "");
		let url = `https://wa.me/${formattedNumber}`;

		if (message) {
			url += `?text=${encodeURIComponent(message)}`;
		}

		// Open in a new tab
		window.open(url, "_blank", "noopener,noreferrer");
		return true;
	} catch (error) {
		console.error("Failed to redirect to WhatsApp:", error);
		return false;
	}
};
