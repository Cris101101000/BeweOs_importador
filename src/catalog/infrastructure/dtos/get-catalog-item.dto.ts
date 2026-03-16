// Unified DTOs for both products and services
export interface GetCatalogItemResponseDto {
	id: string;
	companyId: string;
	name: string;
	description: string;
	category: string;
	basePrice: number;
	tax: number;
	totalPrice: number;
	measureUnit: string;
	measureValue: number;
	formattedMeasure: string;
	brand: string;
	parentId: string | null;
	sku?: string; // Optional for services
	isEnabled: boolean;
	isParent: boolean;
	isVariant: boolean;
	isAiExcluded?: boolean;
	createdAt: string;
	updatedAt: string;
	externalPurchaseUrl: string;
	externalUrl?: string; // External reservation link (only for services)
	// Service-specific optional properties
	duration?: number; // in minutes (only for services)

	// Product-specific optional properties
	// These can be added if needed for products
}

export interface GetCatalogItemsResponseDto {
	items: GetCatalogItemResponseDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateCatalogItemRequestDto {
	name: string;
	description?: string;
	category: string;
	basePrice: number;
	tax?: number;
	measureUnit?: string;
	measureValue?: number;
	brand?: string;
	sku?: string; // Optional for services
	isEnabled?: boolean;
	externalPurchaseUrl?: string;
	externalUrl?: string; // External reservation link (only for services)

	// Service-specific optional properties
	duration?: number; // in minutes (only for services)
}

export interface UpdateCatalogItemRequestDto {
	name?: string;
	description?: string;
	category?: string;
	basePrice?: number;
	tax?: number;
	measureUnit?: string;
	measureValue?: number;
	brand?: string;
	sku?: string;
	isEnabled?: boolean;
	isAiExcluded?: boolean;
	externalPurchaseUrl?: string;
	externalUrl?: string; // External reservation link (only for services)

	// Service-specific optional properties
	duration?: number; // in minutes (only for services)
}
