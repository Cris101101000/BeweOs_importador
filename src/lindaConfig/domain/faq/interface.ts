export interface IFAQ {
	id: string;
	agencyId: string;
	companyId: string;
	question: string;
	answer: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreateFAQInput {
	question: string;
	answer: string;
	// isActive?: boolean;
}

export interface IUpdateFAQInput {
	question?: string;
	answer?: string;
	isActive?: boolean;
}

export interface IFAQFilters {
	search?: string;
	isActive?: boolean;
	limit?: number;
	offset?: number;
}

export interface IFAQPagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface IFAQListResponse {
	items: IFAQ[];
	pagination: IFAQPagination;
	filters: IFAQFilters;
}

// Interface for FAQ data extracted from knowledge gaps
export interface IFAQFromKnowledgeGap {
	question: string;
	answer: string;
	gapId: string;
}
