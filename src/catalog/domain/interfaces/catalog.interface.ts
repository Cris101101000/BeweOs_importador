import type { EnumCatalogStatus } from "../enums/catalog-status.enum";
import type { EnumCatalogType } from "../enums/catalog-type.enum";
import type { EnumProductType } from "../enums/product-type.enum";
import type { ICatalogCategory } from "./catalog-category.interface";
import type { ICatalogFilters } from "./catalog-filter.interface";

export interface ICatalogItem {
	id: string;
	name: string;
	description?: string;
	price: number;
	currency: string;
	categoryId: string;
	category?: ICatalogCategory;
	status: EnumCatalogStatus;
	type: EnumCatalogType;
	productType?: EnumProductType;
	interestCount: number;
	images?: string[];
	tags?: string[];
	pdfUrl?: string;
	pdfName?: string;
	duration?: number; // in minutes (only for services)
	metadata?: Record<string, unknown>;
	createdAt: Date;
	externalPurchaseUrl: string;
	externalUrl?: string; // external reservation link (only for services)
	updatedAt: Date;
}

export interface ICatalogPagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface ICatalogResponse {
	items: ICatalogItem[];
	pagination: ICatalogPagination;
	filters: ICatalogFilters;
}

export interface ICreateCatalogItemRequest {
	name: string;
	description?: string;
	price: number;
	currency: string;
	categoryId: string;
	type: EnumCatalogType;
	productType?: EnumProductType;
	status?: EnumCatalogStatus;
	interestCount?: number;
	images?: string[];
	tags?: string[];
	pdfUrl?: string;
	pdfName?: string;
	duration?: number | string;
	metadata?: Record<string, unknown>;
	externalPurchaseUrl?: string;
	externalUrl?: string;
}

export interface IUpdateCatalogItemRequest
	extends Partial<ICreateCatalogItemRequest> {
	id: string;
	isAiExcluded?: boolean;
}
