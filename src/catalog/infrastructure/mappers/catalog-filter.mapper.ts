import { EnumCatalogStatus } from "@catalog/domain/enums/catalog-status.enum";
import type { ICatalogFilters } from "@catalog/domain/interfaces/catalog-filter.interface";

export interface GetCatalogItemsByFilterRequestDto {
	search?: string;
	categories?: string;
	isEnabled?: boolean;
	minPrice?: number;
	maxPrice?: number;
	brand?: string;
	minDuration?: number;
	maxDuration?: number;
	page?: number;
	limit?: number;
	order?: string;
	createdFrom?: string;
	createdTo?: string;
}

/**
 * Generic mapper for catalog filters that works for both products and services
 */
export const toGetCatalogItemsByFilterRequestDto = (
	filters: ICatalogFilters
): GetCatalogItemsByFilterRequestDto => {
	// Helper function to check if string has content
	const hasContent = (str?: string): str is string =>
		typeof str === "string" && str.trim().length > 0;

	// Build request DTO with API format keys
	return {
		// String filters - only if they have content
		...(hasContent(filters.search) && { search: filters.search.trim() }),
		...(hasContent(filters.categoryId) && { categories: filters.categoryId }),
		...(filters.status && { isEnabled: filters.status === "active" }),

		// Numeric filters - only if they are defined (including 0)
		...(filters.priceMin !== undefined && { minPrice: filters.priceMin }),
		...(filters.priceMax !== undefined && { maxPrice: filters.priceMax }),
		...(hasContent(filters.brandId) && { brand: filters.brandId }),
		...(filters.durationMin !== undefined && {
			minDuration: filters.durationMin,
		}),
		...(filters.durationMax !== undefined && {
			maxDuration: filters.durationMax,
		}),
		...(filters.page !== undefined && { page: filters.page }),
		...(filters.limit !== undefined && { limit: filters.limit }),
	} as GetCatalogItemsByFilterRequestDto;
};

/**
 * Converts GetCatalogItemsByFilterRequestDto to ICatalogFilters
 * This is the inverse mapper for converting DTO back to domain interface
 */
export const toCatalogFiltersFromRequestDto = (
	dto: GetCatalogItemsByFilterRequestDto
): ICatalogFilters => {
	const filter: ICatalogFilters = {};

	// String filters
	if (dto.search) filter.search = dto.search;
	if (dto.categories) filter.categoryId = dto.categories;
	if (dto.isEnabled !== undefined)
		filter.status = dto.isEnabled
			? EnumCatalogStatus.Active
			: EnumCatalogStatus.Inactive;

	// Numeric filters
	if (dto.minPrice !== undefined) filter.priceMin = dto.minPrice;
	if (dto.maxPrice !== undefined) filter.priceMax = dto.maxPrice;
	if (dto.brand) filter.brandId = dto.brand;
	if (dto.minDuration !== undefined) filter.durationMin = dto.minDuration;
	if (dto.maxDuration !== undefined) filter.durationMax = dto.maxDuration;
	if (dto.page !== undefined) filter.page = dto.page;
	if (dto.limit !== undefined) filter.limit = dto.limit;

	return filter;
};

// Legacy exports for backward compatibility - using different names to avoid conflicts
export type GetProductsByFilterRequestDto = GetCatalogItemsByFilterRequestDto;
export const toGetProductsByFilterRequestDto =
	toGetCatalogItemsByFilterRequestDto;

export interface IApiCatalogFilters {
	categories?: string;
	isEnabled?: boolean;
	minPrice?: number;
	maxPrice?: number;
	brand?: string;
	minDuration?: number;
	maxDuration?: number;
}

/**
 * Maps DrawerFilters format to API format using filters configuration
 * @param drawerFilters - Raw filters from DrawerFilters component
 * @param type - Catalog type (Product or Service)
 * @returns API-formatted filters
 */
export const mapDrawerFiltersToApiFormat = (
	drawerFilters: Record<string, any>
): IApiCatalogFilters => {
	const apiFilters: IApiCatalogFilters = {};

	// Map each filter from drawer format to API format
	for (const key in drawerFilters) {
		const value = drawerFilters[key];

		if (key === "duration") {
			const valueArray = value.split("-");
			apiFilters.minDuration =
				Number.parseInt(valueArray[0]) === 0
					? 1
					: Number.parseInt(valueArray[0]);
			apiFilters.maxDuration = Number.parseInt(valueArray[1]);
		} else if (key === "price") {
			const valueArray = value.split("-");
			apiFilters.minPrice =
				Number.parseInt(valueArray[0]) === 0
					? 1
					: Number.parseInt(valueArray[0]);
			apiFilters.maxPrice = Number.parseInt(valueArray[1]);
		} else if (key === "isEnabled") {
			apiFilters.isEnabled = value === "inactive" ? undefined : true;
		} else if (key === "categories") {
			// Handle categories as comma-separated string
			apiFilters.categories = value;
		} else if (key === "brand") {
			// Handle brand as comma-separated string
			apiFilters.brand = value;
		} else {
			// For any other keys, assign directly
			apiFilters[key as keyof IApiCatalogFilters] = value;
		}
	}

	console.log("apiFilters mapped:", apiFilters);

	return apiFilters;
};

/**
 * Converts API filters to internal catalog filters format
 * @param apiFilters - API formatted filters from DrawerFilters
 * @returns Internal catalog filters
 */
export const mapApiFiltersToInternalFormat = (
	apiFilters: IApiCatalogFilters
): ICatalogFilters => {
	const internalFilters: ICatalogFilters = {};

	// Convert isEnabled to status
	if (apiFilters.isEnabled !== undefined) {
		internalFilters.status = apiFilters.isEnabled
			? EnumCatalogStatus.Active
			: EnumCatalogStatus.Inactive;
	}

	// Convert categories to categoryId
	if (apiFilters.categories) {
		internalFilters.categoryId = apiFilters.categories;
	}

	// Convert price range
	if (apiFilters.minPrice !== undefined) {
		internalFilters.priceMin = apiFilters.minPrice;
	}
	if (apiFilters.maxPrice !== undefined) {
		internalFilters.priceMax = apiFilters.maxPrice;
	}

	// Convert brand filter
	if (apiFilters.brand) {
		internalFilters.brandId = apiFilters.brand;
	}

	// Convert duration range
	if (apiFilters.minDuration !== undefined) {
		internalFilters.durationMin = apiFilters.minDuration;
	}
	if (apiFilters.maxDuration !== undefined) {
		internalFilters.durationMax = apiFilters.maxDuration;
	}

	return internalFilters;
};

/**
 * Converts internal catalog filters to API format for counting
 * @param internalFilters - Internal catalog filters
 * @returns API formatted filters
 */
export const convertInternalFiltersToApiFormat = (
	internalFilters: ICatalogFilters
): IApiCatalogFilters => {
	const apiFilters: IApiCatalogFilters = {};

	// Convert status to isEnabled
	if (internalFilters.status) {
		apiFilters.isEnabled = internalFilters.status === "active";
	}

	// Convert categoryId to categories
	if (internalFilters.categoryId) {
		apiFilters.categories = internalFilters.categoryId;
	}

	// Convert price range
	if (internalFilters.priceMin !== undefined) {
		apiFilters.minPrice = internalFilters.priceMin;
	}
	if (internalFilters.priceMax !== undefined) {
		apiFilters.maxPrice = internalFilters.priceMax;
	}

	// Convert brand filter
	if (internalFilters.brandId) {
		apiFilters.brand = internalFilters.brandId;
	}

	// Convert duration range
	if (internalFilters.durationMin !== undefined) {
		apiFilters.minDuration = internalFilters.durationMin;
	}
	if (internalFilters.durationMax !== undefined) {
		apiFilters.maxDuration = internalFilters.durationMax;
	}

	return apiFilters;
};

/**
 * Counts the number of active filters in API format
 * @param apiFilters - API formatted filters
 * @returns Number of active filters
 */
export const countActiveFilters = (apiFilters: IApiCatalogFilters): number => {
	let count = 0;

	// Count boolean filters - including undefined isEnabled as it represents "inactive" filter
	if (apiFilters.hasOwnProperty("isEnabled")) {
		count++;
	}

	// Count string filters (categories, brand)
	if (apiFilters.categories && apiFilters.categories.trim().length > 0) {
		count++;
	}
	if (apiFilters.brand && apiFilters.brand.trim().length > 0) {
		count++;
	}

	// Count price range filters
	if (apiFilters.minPrice !== undefined || apiFilters.maxPrice !== undefined) {
		count++;
	}

	// Count duration range filters
	if (
		apiFilters.minDuration !== undefined ||
		apiFilters.maxDuration !== undefined
	) {
		count++;
	}

	return count;
};

/**
 * Counts the number of active filters in any format (API or internal)
 * @param filters - Filters in any format
 * @returns Number of active filters
 */
export const countActiveFiltersFlexible = (filters: any): number => {
	if (!filters) return 0;

	let count = 0;

	// Check for API format filters - including undefined isEnabled as it represents "inactive" filter
	if (filters.isEnabled !== undefined || filters.hasOwnProperty("isEnabled")) {
		count++;
	}
	if (filters.categories && filters.categories.trim().length > 0) {
		count++;
	}
	if (filters.brand && filters.brand.trim().length > 0) {
		count++;
	}
	if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
		count++;
	}
	if (filters.minDuration !== undefined || filters.maxDuration !== undefined) {
		count++;
	}

	// Check for internal format filters
	if (filters.status !== undefined) {
		count++;
	}
	if (filters.categoryId && filters.categoryId.trim().length > 0) {
		count++;
	}
	if (filters.brandId && filters.brandId.trim().length > 0) {
		count++;
	}
	if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
		count++;
	}
	if (filters.durationMin !== undefined || filters.durationMax !== undefined) {
		count++;
	}

	// Check for search filter
	if (filters.search && filters.search.trim().length > 0) {
		count++;
	}

	return count;
};
