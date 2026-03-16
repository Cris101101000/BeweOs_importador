import type { ICatalogFilters } from "@catalog/domain/interfaces/catalog-filter.interface";

export interface GetProductsByFilterRequestDto {
	search?: string;
	categoryId?: string;
	status?: string;
	priceMin?: number;
	priceMax?: number;
	page?: number;
	limit?: number;
	order?: string;
	createdFrom?: string;
	createdTo?: string;
}

export const toGetProductsByFilterRequestDto = (
	filters: ICatalogFilters
): GetProductsByFilterRequestDto => {
	// Helper function to check if string has content
	const hasContent = (str?: string): str is string =>
		typeof str === "string" && str.trim().length > 0;

	// Build request DTO with only defined values using object spread and conditional properties
	return {
		// String filters - only if they have content
		...(hasContent(filters.search) && { search: filters.search.trim() }),
		...(hasContent(filters.categoryId) && { categoryId: filters.categoryId }),
		...(hasContent(filters.status) && { status: filters.status }),
		...(hasContent(filters.order) && { order: filters.order }),

		// Numeric filters - only if they are defined (including 0)
		...(filters.priceMin !== undefined && { priceMin: filters.priceMin }),
		...(filters.priceMax !== undefined && { priceMax: filters.priceMax }),
		...(filters.page !== undefined && { page: filters.page }),
		...(filters.limit !== undefined && { limit: filters.limit }),

		// Date filters - only if dates exist
		...(filters.createdFrom && {
			createdFrom: filters.createdFrom.toISOString(),
		}),
		...(filters.createdTo && {
			createdTo: filters.createdTo.toISOString(),
		}),
	} as GetProductsByFilterRequestDto;
};

/**
 * Converts GetProductsByFilterRequestDto to ICatalogFilters
 * This is the inverse mapper for converting DTO back to domain interface
 */
export const toCatalogFiltersFromRequestDto = (
	dto: GetProductsByFilterRequestDto
): ICatalogFilters => {
	const filter: ICatalogFilters = {};

	// String filters
	if (dto.search) filter.search = dto.search;
	if (dto.categoryId) filter.categoryId = dto.categoryId;
	if (dto.status) filter.status = dto.status;
	if (dto.order) filter.order = dto.order;

	// Numeric filters
	if (dto.priceMin !== undefined) filter.priceMin = dto.priceMin;
	if (dto.priceMax !== undefined) filter.priceMax = dto.priceMax;
	if (dto.page !== undefined) filter.page = dto.page;
	if (dto.limit !== undefined) filter.limit = dto.limit;

	// Date filters - convert ISO strings back to Date objects
	if (dto.createdFrom) filter.createdFrom = new Date(dto.createdFrom);
	if (dto.createdTo) filter.createdTo = new Date(dto.createdTo);

	return filter;
};
