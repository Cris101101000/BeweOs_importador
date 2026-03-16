export const countries = [
	{ key: "us", label: "Estados Unidos" },
	{ key: "mx", label: "México" },
	{ key: "co", label: "Colombia" },
	{ key: "pe", label: "Perú" },
	{ key2: "es", label: "España" },
];

export const getCountryKeyByCode = (code: string): string => {
	const country = countries.find(
		(c) => c.key === code.toLowerCase() || c.key2 === code.toLowerCase()
	);
	return country?.key || country?.key2 || "";
};
