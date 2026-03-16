/**
 * Phone DTO - Shared data transfer object for phone information
 * Used across multiple entities (clients, contacts, etc.)
 */
export interface PhoneDto {
	/** Unique identifier for the phone record */
	id?: string;

	/** Country code (e.g., "+1", "+34", "+52") */
	code: string;

	/** Country name or ISO code */
	country: string;

	/** Phone number without country code */
	number: string;

	/** Type of phone (main, secondary, work, etc.) */
	type?: string;

	/** Whether this phone number is visible/active */
	isVisible?: boolean;

	/** Available communication channels for this phone */
	channels?: string[];

	/** Creation timestamp */
	createdAt?: string; // ISO date string

	/** Last update timestamp */
	updatedAt?: string; // ISO date string
}
