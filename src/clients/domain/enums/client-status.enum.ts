export const EnumClientStatus = {
	LEAD: "lead",
	PROSPECT: "prospect",
	CLIENT: "client",
	EX_CLIENT: "ex_client",
	IMPORTED: "imported",
} as const;

export type EnumClientStatus =
	(typeof EnumClientStatus)[keyof typeof EnumClientStatus];
