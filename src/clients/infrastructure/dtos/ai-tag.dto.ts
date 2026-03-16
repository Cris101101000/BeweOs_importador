export interface AiTagDto {
	id?: string;
	/** Título del tag - El API retorna "title" */
	title: string;
	color?: string;
	action?: string;
	/** Fecha de creación del registro - puede venir como Date o string desde la API */
	createdAt?: Date | string;
	/** Fecha de actualización del registro - puede venir como Date o string desde la API */
	updatedAt?: Date | string;
	/** ID del usuario que crea el registro */
	createdBy?: string;
}

export interface CreateAiTagRequestDto {
	clientId: string;
	title: string;
	color?: string;
}

/**
 * Query parameters for fetching AI tags from backend
 * Endpoint: GET /tags?applicableEntities=CLIENT&title=...
 */
export interface GetAiTagsQueryDto {
	/** Filter by applicable entity type */
	applicableEntities: "CLIENT";
	/** Optional title filter for searching tags */
	title?: string;
}

/**
 * Response DTO from GET /tags endpoint
 */
export type GetAiTagsResponseDto = AiTagDto[];
