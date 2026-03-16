import type { ICatalogExportResponse } from "../interfaces/catalog-export.interface";
import type { ICatalogFilters } from "../interfaces/catalog-filter.interface";
import type {
	ICatalogItem,
	ICatalogResponse,
	ICreateCatalogItemRequest,
	IUpdateCatalogItemRequest,
} from "../interfaces/catalog.interface";

export interface ICatalogPort {
	getCatalogItems(
		filters?: ICatalogFilters | Record<string, any>
	): Promise<ICatalogResponse>;
	getCatalogItemById(id: string): Promise<ICatalogItem>;
	createCatalogItem(item: ICreateCatalogItemRequest): Promise<ICatalogItem>;
	updateCatalogItem(item: IUpdateCatalogItemRequest): Promise<ICatalogItem>;
	deleteCatalogItem(id: string): Promise<void>;
	deleteCatalogManyItems(ids: string[]): Promise<void>;
	uploadFile(file: File, entityId: string): Promise<string>;
	exportCatalogItems(
		filters?: ICatalogFilters | Record<string, any>
	): Promise<ICatalogExportResponse>;
}
