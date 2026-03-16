/**
 * Checks if the current device is a mobile device based on the user agent string.
 *
 * @returns {boolean} True if the device is identified as mobile, false otherwise.
 */
export const isMobileDevice = (): boolean => {
	if (typeof window === "undefined") {
		return false;
	}

	const userAgent = window.navigator.userAgent.toLowerCase();
	const mobileKeywords = [
		"android",
		"webos",
		"iphone",
		"ipad",
		"ipod",
		"blackberry",
		"windows phone",
	];

	return mobileKeywords.some((keyword) => userAgent.includes(keyword));
};
