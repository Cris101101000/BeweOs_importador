/**
 * Address DTO - Shared data transfer object for address information
 * Used across multiple entities (clients, businesses, locations, etc.)
 */

/**
 * Address DTO interface matching API response structure
 */
export interface AddressDto {
	/** Unique identifier for the address record */
	id: string;

	/** Full street address */
	address: string;

	/** Google Maps URL for the location */
	urlGoogleMaps: string;

	/** Country name or ISO code */
	country: string;

	/** City name */
	city: string;

	/** Postal/ZIP code */
	zip: string;

	/** Creation timestamp */
	createdAt: string; // ISO date string

	/** Last update timestamp */
	updatedAt: string; // ISO date string
}

/**
 * Partial address DTO for create operations
 */
export interface CreateAddressDto {
	address: string;
	urlGoogleMaps?: string;
	country: string;
	city: string;
	zip: string;
}

/**
 * Address update DTO
 */
export interface UpdateAddressDto extends Partial<CreateAddressDto> {
	id: string;
}

/**
 * Simplified address DTO for basic operations
 */
export interface AddressSummaryDto {
	id: string;
	address: string;
	city: string;
	country: string;
}
