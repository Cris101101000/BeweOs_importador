export interface GetServiceResponseDto {
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
	isEnabled: boolean;
	isParent: boolean;
	isVariant: boolean;
	createdAt: string;
	updatedAt: string;

	// images?: string[];
	// pdfUrl?: string;
	// pdfName?: string;
	duration?: number; // in minutes
}

export interface CreateServiceRequestDto {
	name: string;
	description?: string;
	basePrice: number;
	tax: number;
	measureUnit: string;
	measureValue: number;
	category: string;
	isEnabled: boolean;
}

export interface UpdateServiceRequestDto {
	name?: string;
	description?: string;
	basePrice?: number;
	tax?: number;
	measureUnit?: string;
	measureValue?: number;
	category?: string;
	isEnabled?: boolean;
}
