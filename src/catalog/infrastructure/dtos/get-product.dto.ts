export interface GetProductResponseDto {
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
	sku: string;
	isEnabled: boolean;
	isParent: boolean;
	isVariant: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateProductRequestDto {
	name: string; // * required
	description?: string; // optional
	category: string; // * required
	// currency: string;
	basePrice: number; // * required
	tax?: number; // optional
	measureUnit?: string; // optional
	measureValue?: number; // optional
	brand?: string; // optional
	sku?: string; // optional
	isEnabled?: boolean; // optional, default: true
}

export interface UpdateProductRequestDto {
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
}
