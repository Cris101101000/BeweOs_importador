export interface KnowledgeGapDataDTO {
	context: string;
	question: string;
	frequency: string;
	suggested_answer: string;
	service_name: string;
	product_name: string;
	category: string;
	estimated_price: number;
}

export interface KnowledgeGapItemDTO {
	id: string;
	agencyId: string;
	companyId: string;
	type: string;
	status: string;
	description: string;
	requiresApproval: boolean;
	data: KnowledgeGapDataDTO;
	createdAt: string;
	updatedAt: string;
}

export interface KnowledgeGapListDataDTO {
	items: KnowledgeGapItemDTO[];
	total: number;
}
