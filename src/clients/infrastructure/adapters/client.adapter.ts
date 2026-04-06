import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import type {
	IClient,
	IClientResponse,
} from "@clients/domain/interfaces/client.interface";
import type {
	IExportConfigRequest,
	IExportResponse,
} from "@clients/domain/interfaces/export-config.interface";
import type { IClientPort } from "@clients/domain/ports/client.port";
import { httpService } from "@http";
import type { IHttpClient } from "@http";
import type { CreateClientResponseDto } from "../dtos/create-client.dto";
import type { ExportClientsResponseDto } from "../dtos/export-clients.dto";
import type {
	GetClientResponseDto,
	GetClientsResponseDto,
} from "../dtos/get-client.dto";
import type { GetClientsByFilterRequestDto } from "../dtos/get-clients-by-filter.dto";
import { toGetClientsByFilterRequestDto } from "../mappers/client-filter.mapper";
import { toCreateClientRequestDto } from "../mappers/create-client-request.mapper";
import {
	buildExportQueryParams,
	toExportResponseFromDto,
} from "../mappers/export-clients.mapper";
import { toClientFromResponse } from "../mappers/get-client-response.mapper";
import { toUpdateClientRequestDto } from "../mappers/update-client-request.mapper";
import { LocalContactsStorageService } from "../services/local-contacts-storage.service";

const isMockMode = process.env.REACT_APP_USE_MOCK_DATA === "true";

/** Same query string building for GET /clients and GET /clients/export-csv */
function buildClientsQueryString(
	dto: GetClientsByFilterRequestDto
): string {
	const queryParams = new URLSearchParams();
	for (const [key, value] of Object.entries(dto)) {
		if (Array.isArray(value)) {
			if (value.length > 0) {
				for (const item of value) {
					queryParams.append(key, String(item));
				}
			}
		} else if (value !== undefined) {
			queryParams.append(key, String(value));
		}
	}
	return queryParams.toString();
}

export class ClientAdapter implements IClientPort {
	private readonly httpClient: IHttpClient = httpService;

	async createClient(clientData: IClient): Promise<IClient> {
		if (isMockMode) {
			const storage = LocalContactsStorageService.getInstance();
			const dto = toCreateClientRequestDto(clientData) as GetClientResponseDto;
			const saved = storage.save(dto);
			return toClientFromResponse(saved);
		}

		const requestDto = toCreateClientRequestDto(clientData);

		const response = await this.httpClient.post<CreateClientResponseDto>(
			"/clients",
			requestDto
		);

		if (response.success && response.data && response.data.id) {
			return response.data;
		}

		if (!response.success) {
			throw new Error(response.error?.code);
		}

		throw new Error("failed_to_create_client");
	}

	async getClientById(clientId: string): Promise<IClient> {
		if (isMockMode) {
			const storage = LocalContactsStorageService.getInstance();
			const contact = storage.getById(clientId);
			if (contact) return toClientFromResponse(contact);
			throw new Error("client_not_found");
		}

		const response = await this.httpClient.get<GetClientResponseDto>(
			`/clients/${clientId}`
		);

		if (response.success && response.data) {
			return toClientFromResponse(response.data);
		}

		throw new Error(response.error?.code || "api_call_failed");
	}

	async getClientsByFilters(filters?: IClientFilter): Promise<IClientResponse> {
		if (isMockMode) {
			return this.getClientsFromLocalStorage(filters);
		}

		const requestDto = filters ? toGetClientsByFilterRequestDto(filters) : {};
		const queryString = buildClientsQueryString(requestDto);
		const url = queryString ? `/clients?${queryString}` : "/clients";
		const response = await this.httpClient.get<GetClientsResponseDto>(url);

		// Check if the API call was successful
		if (response.success && response.data && response.data.items) {
			const clients = response.data.items.map(
				(client: GetClientResponseDto) => toClientFromResponse(client)
			);

			// Calculate pagination values from request params
			const requestLimit = filters?.limit || 20;
			const requestOffset = filters?.offset || 0;
			const total = response.data.total;
			const currentPage = Math.floor(requestOffset / requestLimit) + 1;
			const totalPages = Math.ceil(total / requestLimit);

			// Return the complete response with pagination metadata
			return {
				clients,
				total,
				page: currentPage,
				limit: requestLimit,
				totalPages,
			};
		}

		if (!response.success) {
			throw new Error(response.error?.code || "API call failed");
		}

		// If not successful, throw an error with the API error message
		throw new Error(response.error?.code || "API call failed");
	}

	private getClientsFromLocalStorage(filters?: IClientFilter): IClientResponse {
		const storage = LocalContactsStorageService.getInstance();
		const requestLimit = filters?.limit || 20;
		const requestOffset = filters?.offset || 0;

		const { items, total } = storage.getByFilters({
			limit: requestLimit,
			offset: requestOffset,
			search: filters?.search,
			status: filters?.status,
		});

		const clients = items.map((item) => toClientFromResponse(item));
		const currentPage = Math.floor(requestOffset / requestLimit) + 1;
		const totalPages = Math.ceil(total / requestLimit);

		return {
			clients,
			total,
			page: currentPage,
			limit: requestLimit,
			totalPages,
		};
	}

	async updateClient(
		clientId: string,
		updates: Partial<IClient>
	): Promise<IClient> {
		if (isMockMode) {
			const storage = LocalContactsStorageService.getInstance();
			const updateDto = toUpdateClientRequestDto(updates);
			const updated = storage.update(clientId, updateDto);
			if (updated) return toClientFromResponse(updated);
			throw new Error("client_not_found");
		}

		// Map updates using dedicated mapper
		const updateDto: Partial<GetClientResponseDto> =
			toUpdateClientRequestDto(updates);

		// Make API call with PUT method
		const response = await this.httpClient.put<GetClientResponseDto>(
			`/clients/${clientId}`,
			updateDto
		);

		if (response.success && response.data) {
			// Map response back to domain object
			return toClientFromResponse(response.data);
		}

		// Handle API error response
		const errorMessage = response.error?.code || "failed_to_update_client";
		throw new Error(errorMessage);
	}

	async deleteClient(clientId: string): Promise<void> {
		if (isMockMode) {
			const storage = LocalContactsStorageService.getInstance();
			storage.delete(clientId);
			return;
		}

		const response = await this.httpClient.delete(`/clients/${clientId}`);

		if (response.success) {
			return;
		}

		throw new Error(response.error?.code || "API call failed");
	}

	async deleteClients(clientIds: string[]): Promise<void> {
		if (isMockMode) {
			const storage = LocalContactsStorageService.getInstance();
			storage.deleteMany(clientIds);
			return;
		}

		// Build query string with repeated 'ids' params: ?ids=uuid1&ids=uuid2
		const queryParams = new URLSearchParams();
		for (const id of clientIds) {
			queryParams.append("ids", id);
		}

		const url = `/clients?${queryParams.toString()}`;
		const response = await this.httpClient.delete(url);

		if (response.success) {
			return;
		}

		throw new Error(response.error?.code || "API call failed");
	}

	async exportClientsData(
		exportConfig: IExportConfigRequest
	): Promise<IExportResponse> {
		// Same query params as GET /clients (limit capped for export)
		const requestDto = buildExportQueryParams(exportConfig);
		const queryString = buildClientsQueryString(requestDto);
		const url = queryString
			? `/clients/export-csv?${queryString}`
			: "/clients/export-csv";

		const response = await this.httpClient.get<ExportClientsResponseDto>(url);

		if (response.success && response.data) {
			return toExportResponseFromDto(response.data);
		}

		if (!response.success) {
			throw new Error(response.error?.code || "Export API call failed");
		}

		throw new Error("Export API call failed");
	}
}
