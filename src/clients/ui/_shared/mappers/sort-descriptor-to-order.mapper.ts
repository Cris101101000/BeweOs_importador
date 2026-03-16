import type { SortDescriptor } from "@beweco/aurora-ui";
import { EnumOrder } from "@clients/domain/enums/order.enum";
import type { ColumnsKey } from "../components/clients-table/interfaces";

/**
 * Maps UI column keys to backend order enum values
 * This mapping converts the frontend column identifiers to the backend field names
 */
const COLUMN_TO_ORDER_FIELD_MAP: Record<string, keyof typeof EnumOrder | null> =
	{};

// Populate the mapping
COLUMN_TO_ORDER_FIELD_MAP.contact = null; // Name sorting not supported in backend - use search param for filtering
COLUMN_TO_ORDER_FIELD_MAP.email = "Email";
COLUMN_TO_ORDER_FIELD_MAP.phone = null; // Phone sorting not supported in backend
COLUMN_TO_ORDER_FIELD_MAP.status = "Status";
COLUMN_TO_ORDER_FIELD_MAP.potency = "Category"; // Potency maps to category in backend
COLUMN_TO_ORDER_FIELD_MAP.birthdate = "Birthdate";
COLUMN_TO_ORDER_FIELD_MAP.createdAt = "CreatedAt"; // Maps to createdAt field
COLUMN_TO_ORDER_FIELD_MAP.gender = null; // Not supported in current enum
COLUMN_TO_ORDER_FIELD_MAP.last_communication = null; // Not supported in current enum
COLUMN_TO_ORDER_FIELD_MAP.created_channel = null; // Not supported in current enum
COLUMN_TO_ORDER_FIELD_MAP.ai_tags = null; // Not supported in current enum
COLUMN_TO_ORDER_FIELD_MAP.quick_actions = null; // Not sortable

/**
 * Converts a SortDescriptor from the UI table to an EnumOrder value for the backend
 *
 * @param sortDescriptor - The sort descriptor from the table component
 * @returns The corresponding EnumOrder value, or null if sorting is not supported for the column
 *
 * @example
 * ```typescript
 * const sortDescriptor = { column: "createdAt", direction: "ascending" };
 * const orderValue = mapSortDescriptorToOrder(sortDescriptor);
 * // Returns: EnumOrder.CreatedAt
 *
 * const sortDescriptor = { column: "email", direction: "descending" };
 * const orderValue = mapSortDescriptorToOrder(sortDescriptor);
 * // Returns: EnumOrder.EmailDesc
 * ```
 */
export const mapSortDescriptorToOrder = (
	sortDescriptor: SortDescriptor
): EnumOrder | null => {
	const columnKey = sortDescriptor.column as ColumnsKey;
	const direction = sortDescriptor.direction;

	// Get the base field name from the mapping
	const baseFieldKey = COLUMN_TO_ORDER_FIELD_MAP[columnKey];

	if (!baseFieldKey) {
		// Column doesn't support sorting in the backend
		return null;
	}

	// Determine if we need the descending version
	const isDescending = direction === "descending";
	const orderKey = isDescending ? `${baseFieldKey}Desc` : baseFieldKey;

	// Return the enum value
	return EnumOrder[orderKey as keyof typeof EnumOrder] || null;
};

/**
 * Type guard to check if a column supports backend sorting
 *
 * @param columnKey - The column key to check
 * @returns true if the column supports backend sorting
 */
export const isColumnSortable = (columnKey: ColumnsKey): boolean => {
	return COLUMN_TO_ORDER_FIELD_MAP[columnKey] !== null;
};

/**
 * Gets all sortable column keys
 *
 * @returns Array of column keys that support backend sorting
 */
export const getSortableColumns = (): ColumnsKey[] => {
	return Object.keys(COLUMN_TO_ORDER_FIELD_MAP).filter(
		(key) => COLUMN_TO_ORDER_FIELD_MAP[key as ColumnsKey] !== null
	) as ColumnsKey[];
};
