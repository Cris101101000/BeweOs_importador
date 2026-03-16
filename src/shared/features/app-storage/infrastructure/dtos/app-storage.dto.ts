/** Request body para PUT /app-storage */
export interface AppStorageUpsertRequestDto {
	type: string;
	value: string;
	scope: string;
}

/** Response de GET /app-storage/{type}?scope=X */
export interface AppStorageResponseDto {
	id: string;
	type: string;
	value: string;
	agencyId: string;
	companyId?: string;
	userId?: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
}
