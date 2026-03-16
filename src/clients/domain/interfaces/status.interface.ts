import type { EnumClientStatus } from "../enums/client-status.enum";

export interface IStatus {
	translationKey: EnumClientStatus;
	value: EnumClientStatus;
	color: string;
}
