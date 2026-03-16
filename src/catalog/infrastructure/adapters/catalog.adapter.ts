import { httpService } from "@http";
import type { IHttpClient } from "@http";
import {
	EnumCatalogType,
	EnumCatalogTypeApi,
} from "../../domain/enums/catalog-type.enum";
import type { ICatalogExportResponse } from "../../domain/interfaces/catalog-export.interface";
import type { ICatalogFilters } from "../../domain/interfaces/catalog-filter.interface";
import type {
	ICatalogItem,
	ICatalogResponse,
	ICreateCatalogItemRequest,
	IUpdateCatalogItemRequest,
} from "../../domain/interfaces/catalog.interface";
import type { ICatalogPort } from "../../domain/ports/catalog.port";
import type { ExportCatalogResponseDto } from "../dtos/export-catalog.dto";
import type {
	GetCatalogItemResponseDto,
	GetCatalogItemsResponseDto,
} from "../dtos/get-catalog-item.dto";
import {
	toCatalogExportResponseFromDto,
	toCatalogItemFromResponse,
	toCatalogItemsFromResponse,
	toCreateCatalogItemRequestDto,
	toUpdateCatalogItemRequestDto,
} from "../mappers";

export class CatalogAdapter implements ICatalogPort {
	private readonly httpClient: IHttpClient = httpService;

	/**
	 * Extracts resource type and catalog type from current URL path
	 */
	private getResourceTypeInfo(): {
		resourceType: string;
		enumCatalogType: EnumCatalogType;
	} {
		const path = window.location.pathname;
		const resourceType = path.split("/")[2];
		const catalogType =
			EnumCatalogTypeApi[resourceType as keyof typeof EnumCatalogTypeApi];
		const enumCatalogType =
			EnumCatalogType[catalogType as keyof typeof EnumCatalogType];

		return { resourceType, enumCatalogType };
	}

	async getCatalogItems(
		filters?: ICatalogFilters | Record<string, any>
	): Promise<ICatalogResponse> {
		const { resourceType, enumCatalogType } = this.getResourceTypeInfo();

		// Convert arrays to individual query parameters to avoid status[] format
		const queryParams = new URLSearchParams();

		for (const [key, value] of Object.entries(
			filters || ({} as ICatalogFilters)
		)) {
			if (Array.isArray(value)) {
				// Handle arrays by adding multiple parameters with the same key
				if (value.length > 0) {
					for (const item of value) {
						queryParams.append(key, String(item));
					}
				}
			} else if (key === "isEnabled" && value === undefined) {
				// Special case: when isEnabled is undefined (inactive status), send empty parameter
				queryParams.append(key, "");
			} else if (key === "categories" && typeof value === "string") {
				//|| key === 'brand'
				// Special case: convert comma-separated string to array for categories and brand
				const itemsArray = value.includes(",")
					? value
							.split(",")
							.map((item) => item.trim())
							.filter((item) => item.length > 0)
					: [value.trim()].filter((item) => item.length > 0);
				for (const item of itemsArray) {
					queryParams.append(key, item);
				}
			} else if (value !== undefined) {
				queryParams.append(key, String(value));
			}
		}

		const queryString = queryParams.toString();
		const url = `/${resourceType}?${queryString}`;

		const response = await this.httpClient.get<GetCatalogItemsResponseDto>(url);

		if (response.success && response.data) {
			// Unified response handling - both APIs now return the same structure
			const items = toCatalogItemsFromResponse(
				response.data.items,
				enumCatalogType
			);

			// Get total from API response (default to 0 if not provided)
			const total = response.data.total ?? 0;
			const limit = filters?.limit || 10;

			// Calculate pagination info based on real total from API
			const currentPage = Math.floor(filters?.offset / limit) + 1;
			const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

			const pagination = {
				page: currentPage,
				limit: limit,
				total: total,
				totalPages: totalPages,
			};

			return {
				items,
				pagination,
				filters: filters || {},
			};
		}

		throw new Error(response.error?.code || "API call failed");
	}

	async getCatalogItemById(id: string): Promise<ICatalogItem> {
		const { resourceType, enumCatalogType } = this.getResourceTypeInfo();
		const response = await this.httpClient.get<GetCatalogItemResponseDto>(
			`/${resourceType}/${id}`
		);

		if (response.success && response.data) {
			return toCatalogItemFromResponse(response.data, enumCatalogType);
		}

		throw new Error(response.error?.code || "API call failed");
	}

	async createCatalogItem(
		itemData: ICreateCatalogItemRequest
	): Promise<ICatalogItem> {
		const { resourceType, enumCatalogType } = this.getResourceTypeInfo();
		const requestDto = toCreateCatalogItemRequestDto(itemData);
		const response = await this.httpClient.post<GetCatalogItemResponseDto>(
			`/${resourceType}`,
			requestDto
		);

		if (response.success && response.data) {
			return toCatalogItemFromResponse(response.data, enumCatalogType);
		}
		throw new Error(response.error?.code || "API call failed");
	}

	async updateCatalogItem(
		itemData: IUpdateCatalogItemRequest
	): Promise<ICatalogItem> {
		const { resourceType, enumCatalogType } = this.getResourceTypeInfo();
		const requestDto = toUpdateCatalogItemRequestDto(itemData);

		const response = await this.httpClient.put<GetCatalogItemResponseDto>(
			`/${resourceType}/${itemData.id}`,
			requestDto,
			{ timeout: 60000 }
		);

		if (response.success && response.data) {
			return toCatalogItemFromResponse(response.data, enumCatalogType);
		}

		const errorMessage =
			response.error?.message || response.error?.code || "API call failed";
		throw new Error(errorMessage);
	}

	async deleteCatalogItem(id: string): Promise<void> {
		const { resourceType } = this.getResourceTypeInfo();
		const response = await this.httpClient.delete(`/${resourceType}/${id}`);

		if (response.success) {
			return;
		}

		throw new Error(response.error?.code || "API call failed delete item");
	}

	async deleteCatalogManyItems(ids: string[]): Promise<void> {
		const { resourceType } = this.getResourceTypeInfo();
		const response = await this.httpClient.delete(`/${resourceType}`, {
			data: { ids: ids },
		} as any);

		if (response.success) {
			return;
		}

		throw new Error(response.error?.code || "API call failed delete item");
	}

	async uploadFile(file: File, entityId: string): Promise<string> {
		const { resourceType } = this.getResourceTypeInfo();
		const entityType =
			EnumCatalogTypeApi[
				resourceType as keyof typeof EnumCatalogTypeApi
			]?.toLowerCase();

		// Use FormData for file uploads - required for multipart/form-data
		const formData = new FormData();
		formData.append("files", file);
		formData.append("prefix", resourceType);
		formData.append("entityType", entityType);
		formData.append("entityId", entityId);
		formData.append("preserveFileName", "1");

		const response = await this.httpClient.post<any>(
			"assets/upload-files",
			formData
		);

		if (response.success && response.data) {
			return response.data.url || response.data;
		}

		throw new Error(
			response.error?.code || response.error?.message || "File upload failed"
		);
	}

	async exportCatalogItems(
		filters?: ICatalogFilters | Record<string, any>
	): Promise<ICatalogExportResponse> {
		const { resourceType } = this.getResourceTypeInfo();
		const queryParams = new URLSearchParams();

		for (const [key, value] of Object.entries(
			filters || ({} as ICatalogFilters)
		)) {
			if (Array.isArray(value)) {
				if (value.length > 0) {
					for (const item of value) {
						queryParams.append(key, String(item));
					}
				}
			} else if (key === "isEnabled" && value === undefined) {
				// Special case: when isEnabled is undefined (inactive status), send empty parameter
				queryParams.append(key, "");
			} else if (key === "categories" && typeof value === "string") {
				// Special case: convert comma-separated string to array for categories
				const itemsArray = value.includes(",")
					? value
							.split(",")
							.map((item) => item.trim())
							.filter((item) => item.length > 0)
					: [value.trim()].filter((item) => item.length > 0);
				for (const item of itemsArray) {
					queryParams.append("categories", item);
				}
			} else if (key === "priceMin") {
				// Map priceMin to minPrice for API
				if (value !== undefined) {
					queryParams.append("minPrice", String(value));
				}
			} else if (key === "priceMax") {
				// Map priceMax to maxPrice for API
				if (value !== undefined) {
					queryParams.append("maxPrice", String(value));
				}
			} else if (key === "brandId" && value !== undefined) {
				// Keep brandId as is (based on cURL example)
				queryParams.append("brandId", String(value));
			} else if (value !== undefined) {
				// For all other parameters (search, hasMeasure, order, offset, etc.), pass as is
				queryParams.append(key, String(value));
			}
		}

		const queryString = queryParams.toString();
		const url = `/${resourceType}/export-csv?${queryString}`;

		const response = await this.httpClient.get<ExportCatalogResponseDto>(url);
		if (response.success && response.data) {
			const data = response.data as any;

			if (!data.csvContent || typeof data.csvContent !== "string") {
				throw new Error(
					"Invalid export response: csvContent is missing or invalid"
				);
			}
			return toCatalogExportResponseFromDto(response.data);
		}

		if (!response.success) {
			throw new Error(response.error?.code || "Export API call failed");
		}

		throw new Error("Export API call failed");
	}
}
