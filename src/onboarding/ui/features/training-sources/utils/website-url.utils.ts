const PROTOCOL_PREFIX_REGEX = /^https?:\/\//i;

const isIpAddressHostname = (hostname: string): boolean => {
	const ipv4Regex = /^\d{1,3}(\.\d{1,3}){3}$/;
	return ipv4Regex.test(hostname);
};

export const normalizeWebsiteInput = (value: string): string =>
	value.trim().replace(PROTOCOL_PREFIX_REGEX, "");

export const buildPublicWebsiteUrl = (value: string): string =>
	`https://${normalizeWebsiteInput(value)}`;

export const isValidPublicWebsite = (value: string): boolean => {
	const normalizedValue = normalizeWebsiteInput(value);

	if (!normalizedValue || /\s/.test(normalizedValue)) {
		return false;
	}

	let parsedUrl: URL;
	try {
		parsedUrl = new URL(`https://${normalizedValue}`);
	} catch {
		return false;
	}

	const { hostname } = parsedUrl;
	const hostnameParts = hostname.split(".");
	const topLevelDomain =
		hostnameParts.length > 0 ? hostnameParts[hostnameParts.length - 1] : "";

	if (
		hostname.toLowerCase() === "localhost" ||
		isIpAddressHostname(hostname) ||
		hostnameParts.length < 2 ||
		topLevelDomain.length < 2 ||
		!/^[a-z]{2,}$/i.test(topLevelDomain)
	) {
		return false;
	}

	return true;
};
