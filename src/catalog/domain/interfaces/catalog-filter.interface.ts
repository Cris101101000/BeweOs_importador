import type { IPagination } from "@shared/domain/interfaces/pagination.interface";
import type { EnumCatalogStatus } from "../enums/catalog-status.enum";
import type { EnumCatalogType } from "../enums/catalog-type.enum";

export interface ICatalogFilters extends IPagination {
	search?: string;
	categoryId?: string;
	status?: EnumCatalogStatus;
	type?: EnumCatalogType;
	priceMin?: number;
	priceMax?: number;
	brandId?: string;
	durationMin?: number;
	durationMax?: number;
	tags?: string[];
}
