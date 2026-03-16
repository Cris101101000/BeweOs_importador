import { EnumCatalogStatus } from "@catalog/domain/enums/catalog-status.enum";
import { EnumCatalogType } from "@catalog/domain/enums/catalog-type.enum";
import type {
	ICreateCatalogItemRequest,
	IUpdateCatalogItemRequest,
} from "@catalog/domain/interfaces/catalog.interface";
import type {
	CreateProductRequestDto,
	UpdateProductRequestDto,
} from "../dtos/get-product.dto";

/**
 * Generates brand initials from product name
 */
const generateBrandFromName = (name: string): string => {
	return name
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase())
		.join("")
		.substring(0, 3); // Limit to 3 characters max
};

/**
 * Generates SKU from brand and category
 */
const generateSkuFromBrandAndCategory = (
	brand: string,
	category: string
): string => {
	const categoryPrefix = category.substring(0, 3).toUpperCase();
	return `${brand}-${categoryPrefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

/**
 * Maps ICreateCatalogItemRequest to CreateProductRequestDto
 */
export const toCreateProductRequestDto = (
	request: ICreateCatalogItemRequest
): CreateProductRequestDto => {
	// Force category to "tecnologia" since API only accepts this value for now
	// const brand = generateBrandFromName(request.name);
	// const sku = generateSkuFromBrandAndCategory(brand, request.categoryId);

	const result = {
		name: request.name,
		description: request.description || "",
		category: request.categoryId || "otros",
		basePrice: request.price,
		tax: 0, // Default tax value since it's not in domain model
		measureUnit: (request.metadata?.measureUnit as string) || "units", // Use English API format
		measureValue: Number(request.metadata?.measureValue) || 1,
		// brand: brand,
		// sku: sku,
		isEnabled: request.status === EnumCatalogStatus.Active,
	};

	console.log("toCreateProductRequestDto - result:", result);
	return result;
};

/**
 * Maps IUpdateCatalogItemRequest to UpdateProductRequestDto
 * Only includes fields that have been modified
 */
export const toUpdateProductRequestDto = (
	request: IUpdateCatalogItemRequest
): UpdateProductRequestDto => {
	const result: UpdateProductRequestDto = {};

	// Only include fields that are defined (meaning they were modified)
	if (request.name !== undefined) {
		result.name = request.name;
	}

	if (request.description !== undefined) {
		result.description = request.description;
	}

	if (request.categoryId !== undefined) {
		result.category = request.categoryId;
	}

	if (request.price !== undefined) {
		result.basePrice = request.price;
	}

	if (request.status !== undefined) {
		result.isEnabled = request.status === EnumCatalogStatus.Active;
	}

	// Add measureUnit and measureValue if they exist in metadata
	if (request.metadata?.measureUnit !== undefined) {
		result.measureUnit = String(request.metadata.measureUnit);
	}

	if (request.metadata?.measureValue !== undefined) {
		result.measureValue = Number(request.metadata.measureValue);
	}

	// Generate brand and sku if name or category is being updated
	if (request.name !== undefined || request.categoryId !== undefined) {
		const category = "otros";
		const brand = request.name
			? generateBrandFromName(request.name)
			: undefined;
		const sku =
			brand && category
				? generateSkuFromBrandAndCategory(brand, category)
				: undefined;

		if (brand) result.brand = brand;
		if (sku) result.sku = sku;
	}

	return result;
};

/**
 * Maps CreateProductRequestDto to ICreateCatalogItemRequest
 */
export const toCreateCatalogItemRequestFromDto = (
	dto: CreateProductRequestDto
): ICreateCatalogItemRequest => {
	return {
		name: dto.name,
		description: dto.description,
		price: dto.basePrice,
		currency: "COP", // Default currency since it's not in the API DTO
		categoryId: dto.category, // This will be "tecnologia" from the API
		type: EnumCatalogType.Product,
		status: dto.isEnabled
			? EnumCatalogStatus.Active
			: EnumCatalogStatus.Inactive,
		metadata: {
			brand: dto.brand,
			sku: dto.sku,
		},
		// type: dto.type as EnumCatalogType,
		// ...(dto.productType && { productType: dto.productType as EnumProductType }),
		// ...(dto.status && { status: dto.status as EnumCatalogStatus }),
		// ...(dto.interestCount !== undefined && { interestCount: dto.interestCount }),
		// ...(dto.images && dto.images.length > 0 && { images: dto.images }),
		// ...(dto.tags && dto.tags.length > 0 && { tags: dto.tags }),
		// ...(dto.pdfUrl && { pdfUrl: dto.pdfUrl }),
		// ...(dto.pdfName && { pdfName: dto.pdfName }),
		// ...(dto.duration !== undefined && { duration: dto.duration }),
		// ...(dto.metadata && { metadata: dto.metadata }),
	};
};
