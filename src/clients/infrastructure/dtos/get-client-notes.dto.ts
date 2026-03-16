/**
 * DTO de un ítem de nota (alineado con ClientNoteResponseDto del API Gateway).
 * GET /clients/:clientId/notes?limit=10&offset=0
 */
export interface GetClientNotesResponseDto {
	id: string;
	clientId: string;
	type: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
	createdBy?: string;
	/** No viene en la respuesta del API; opcional para compatibilidad */
	companyId?: string;
}

/**
 * Respuesta paginada del API: data.items, data.total, data.limit, data.offset
 */
export interface GetClientNotesPaginatedResponseDto {
	items: GetClientNotesResponseDto[];
	total: number;
	limit: number;
	offset: number;
}
