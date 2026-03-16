/**
 * Interface for table column/field configuration
 * Used to manage visible columns in the clients table
 */
export interface IField {
	/** Unique identifier for the field */
	key: string;
	/** Display label for the field (translation key) */
	label: string;
	/** Whether the field is currently visible in the table */
	isVisible: boolean;
	/** Whether the field can be hidden by the user (default: true) */
	canHide?: boolean;
	/** Data type of the field for filtering purposes */
	dataType?: string;
	/** Order index for sorting columns */
	orderIndex?: number;
}
