// Generic catalog mappers (preferred)
export * from "./catalog-filter.mapper";
export * from "./catalog-item-request.mapper";
export * from "./catalog-item-response.mapper";

// Legacy mappers (for backward compatibility) - specific exports to avoid conflicts
export type { GetProductsByFilterRequestDto } from "./product-filter.mapper";
export {
	toGetProductsByFilterRequestDto,
	toCatalogFiltersFromRequestDto as toCatalogFiltersFromProductRequestDto,
} from "./product-filter.mapper";

export * from "./product-request.mapper";
export * from "./get-product-response.mapper";
export * from "./service-request.mapper";
export * from "./get-service-response.mapper";

// Other mappers
export * from "./category-enums.mapper";
export * from "./catalog-assets.mapper";
export * from "./export-catalog.mapper";
export * from "./knowledge-gap-to-catalog.mapper";
