import type { IClientFilter } from "../interfaces/client-filter.interface";
import type { IClient, IClientResponse } from "../interfaces/client.interface";
import type {
	IExportConfigRequest,
	IExportResponse,
} from "../interfaces/export-config.interface";

export interface IClientPort {
	createClient(clientData: IClient): Promise<IClient>;
	getClientById(clientId: string): Promise<IClient>;
	getClientsByFilters(filters?: IClientFilter): Promise<IClientResponse>;
	updateClient(clientId: string, updates: Partial<IClient>): Promise<IClient>;
	deleteClient(clientId: string): Promise<void>;
	deleteClients(clientIds: string[]): Promise<void>;
	exportClientsData(
		exportConfig: IExportConfigRequest
	): Promise<IExportResponse>;
}
