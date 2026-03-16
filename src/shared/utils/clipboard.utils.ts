/**
 * Utility functions for interacting with the clipboard
 */

/**
 * Represents the result of a clipboard copy operation.
 * Can be either a success or an error state.
 */
type CopyResult =
	| { success: true; value: string }
	| { success: false; error: Error };

/**
 * Asynchronously copies a string to the clipboard.
 *
 * This function uses the modern `navigator.clipboard.writeText` API, which is
 * available in secure contexts (HTTPS). It gracefully handles cases where the
 * clipboard API is not available or fails.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @param {boolean} [removeSpaces=false] - If true, all whitespace characters will be removed from the text before copying.
 * @returns {Promise<CopyResult>} A promise that resolves to a `CopyResult` object.
 *   - On success: `{ success: true, value: string }`
 *   - On failure: `{ success: false, error: Error }`
 *
 * @example
 * // Simple copy
 * const result1 = await copyToClipboard("Hello, world!");
 *
 * // Copy without spaces
 * const result2 = await copyToClipboard("+57 301 343 7122", true);
 * // This will copy "+573013437122"
 */
export const copyToClipboard = async (
	text: string,
	removeSpaces = false
): Promise<CopyResult> => {
	// Text to be copied
	const textToCopy = removeSpaces ? text.replace(/\s/g, "") : text;

	// Check if the Clipboard API is available
	if (!navigator.clipboard) {
		return {
			success: false,
			error: new Error("Clipboard API not supported"),
		};
	}

	try {
		// Attempt to write the text to the clipboard
		await navigator.clipboard.writeText(textToCopy);
		return { success: true, value: textToCopy };
	} catch (err) {
		// Handle potential errors, such as permissions issues
		return {
			success: false,
			error:
				err instanceof Error
					? err
					: new Error("Failed to copy text to clipboard"),
		};
	}
};
