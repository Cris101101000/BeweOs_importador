export interface FAQItemDTO {
	id: string;
	agencyId: string;
	companyId: string;
	question: string;
	answer: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface FAQListDataDTO {
	items: FAQItemDTO[];
	total: number;
}

// Create FAQ DTOs
export interface CreateFAQRequestDTO {
	question: string;
	answer: string;
	// isActive: boolean;
}

export interface CreateFAQResponseDTO {
	id: string;
	agencyId: string;
	companyId: string;
	question: string;
	answer: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

// Update FAQ DTOs
export interface UpdateFAQRequestDTO {
	question?: string;
	answer?: string;
	isActive?: boolean;
}

export interface UpdateFAQResponseDTO {
	id: string;
	agencyId: string;
	companyId: string;
	question: string;
	answer: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}
