/**
 * Client address (from API).
 */
export interface IAddress {
	address?: string;
	urlGoogleMaps?: string | null;
	country?: string;
	city?: string;
	zip?: string;
	createdAt?: string;
	updatedAt?: string;
}
