import { EnumClientStatus } from "../enums/client-status.enum";

export const STATUS_CLIENT = {
	lead: {
		translationKey: "client_status_lead",
		value: EnumClientStatus.LEAD,
		order: 0,
		color: "blue",
	},
	prospect: {
		translationKey: "client_status_prospect",
		value: EnumClientStatus.PROSPECT,
		order: 1,
		color: "purple",
	},
	client: {
		translationKey: "client_status_client",
		value: EnumClientStatus.CLIENT,
		order: 2,
		color: "green",
	},
	ex_client: {
		translationKey: "client_status_ex_client",
		value: EnumClientStatus.EX_CLIENT,
		order: 3,
		color: "red",
	},
};
