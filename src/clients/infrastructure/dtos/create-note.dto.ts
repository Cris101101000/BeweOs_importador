/**
 * Body para POST /clients/:clientId/notes (CreateClientNoteDto del API Gateway).
 * clientId va en la ruta, no en el body.
 */
export interface CreateNoteRequestDto {
	content: string;
	title?: string;
	type?: "quick" | "standard";
}

export interface CreateNoteResponseDto {
	id: string;
	clientId: string;
	companyId: string;
	type: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
}
