// Adapters
export { CatalogAdapter } from "./adapters/catalog.adapter";
export { CatalogEnumsAdapter } from "./adapters/catalog-enums.adapter";
export { CatalogAssetsAdapter } from "./adapters/catalog-assets.adapter";

// DTOs
export type {
	GetProductResponseDto,
	CreateProductRequestDto,
	UpdateProductRequestDto,
} from "./dtos/get-product.dto";
export type {
	GetServiceResponseDto,
	CreateServiceRequestDto,
	UpdateServiceRequestDto,
} from "./dtos/get-service.dto";
export type {
	GetCatalogEnumsResponseDto,
	CatalogEnumsDto,
} from "./dtos/get-catalog-enums.dto";
export type {
	GetCatalogAssetResponseDto,
	GetCatalogAssetsResponseDto,
} from "./dtos/get-catalog-assets.dto";

// Mappers
export { toProductFromResponse } from "./mappers/get-product-response.mapper";
export { toServiceFromResponse } from "./mappers/get-service-response.mapper";
export {
	toCreateProductRequestDto,
	toUpdateProductRequestDto,
	toCreateCatalogItemRequestFromDto,
} from "./mappers/product-request.mapper";
export {
	toCreateServiceRequestDto,
	toUpdateServiceRequestDto,
	toCreateCatalogItemRequestFromServiceDto,
} from "./mappers/service-request.mapper";
export {
	toGetProductsByFilterRequestDto,
	toCatalogFiltersFromRequestDto,
} from "./mappers/product-filter.mapper";
export { mapApiCategoriesToCatalogCategories } from "./mappers/category-enums.mapper";
