import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { EnumFieldType } from "@clients/domain/types/data-type.type";

/**
 * Props for the ClientsTable component
 */
export interface ClientsTableProps {
	items: IClient[];
	onCreateClient?: () => void;
}

/**
 * Available column keys for the clients table
 */
export type ColumnsKey = string;

/**
 * Column definition for the clients table
 */
export interface ClientTableColumn {
	uid: ColumnsKey;
	name: string;
	sortable?: boolean;
	info?: string;
	type: EnumFieldType;
}
