export interface QuickStartItemDTO {
	id: string;
	agencyId: string;
	companyId: string;
	text: string;
	icon: string;
	type: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface QuickStartDataDTO {
	items: QuickStartItemDTO[];
	total: number;
}

export interface QuickStartListResponseDTO {
	success: boolean;
	message: string;
	data: QuickStartDataDTO;
	timestamp: string;
}

export interface QuickStartSingleResponseDTO {
	success: boolean;
	message: string;
	data: QuickStartItemDTO;
	timestamp: string;
}

export interface CreateQuickStartDTO {
	text: string;
	icon: string;
	type: string;
	isActive: boolean;
}

export interface UpdateQuickStartDTO {
	text?: string;
	icon?: string;
	isActive?: boolean;
}
