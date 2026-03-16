import type { IFastClient } from "@clients/domain/interfaces/client.interface";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";

/**
 * Default phone configuration for quick contact form
 */
export const DEFAULT_PHONE: IPhone = {
	code: "+57",
	country: "CO",
	number: "",
};

/**
 * Default values for the quick contact form
 */
export const DEFAULT_VALUES: IFastClient = {
	firstName: "",
	lastName: "",
	phone: DEFAULT_PHONE,
	email: "",
};
