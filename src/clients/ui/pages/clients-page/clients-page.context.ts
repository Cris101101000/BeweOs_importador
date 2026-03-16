import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { IField } from "@clients/domain/interfaces/field.interface";

/**
 * Shared outlet context for Clients routing subtree.
 * Components rendered via <Outlet /> can use this type with useOutletContext.
 */
export type ClientsOutletContext = {
	clients: IClient[];
	fields: IField[];
	isLoadingFields: boolean;
	setFieldVisibility: (fieldKey: string, visible: boolean) => void;
	handleOpenWizard: () => void;
	// Properties from the filter hook
	totalClients: number;
	isLoadingClients: boolean;
	clientsError: Error | null;
	refetchClients: () => Promise<void>;
};
