/**
 * AI Tag Interface
 *
 * Represents an AI tag that can be applied to clients for categorization
 * and segmentation purposes.
 */
export interface IAiTag {
	/**
	 * Unique identifier for the tag
	 */
	id?: string;

	/**
	 * Display value/name of the tag
	 */
	value: string;

	/**
	 * Optional color for visual representation
	 * Should be a valid CSS color value (hex, rgb, hsl, etc.)
	 */
	color?: string;

	/**
	 * Optional icon identifier for the tag
	 * Can be used with icon libraries or custom icon systems
	 */
	icon?: string;
	/**
	 * Optional action for the tag
	 */
	action?: string;

	/**
	 * Optional description providing more context about the tag
	 */
	description?: string;

	/**
	 * Creation timestamp
	 */
	createdAt?: string;

	/**
	 * Last update timestamp
	 */
	updatedAt?: string;

	/**
	 * Created by user
	 */
	createdBy?: string;
}
