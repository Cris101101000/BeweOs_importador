/**
 * DTO para una idea individual del banco de ideas
 * Maps to: GET /linda/idea-bank
 */
export interface IdeaDto {
	id: string;
	proposal_id: string;
	company_id: string;
	company_name: string;
	agency_id: string;
	agency_name: string;
	suggested_title: string;
	suggested_description: string;
	suggested_prompt: string;
	suggested_channels: string[];
	type: string;
	content_type: string;
	evaluation_score: number;
	scoring_breakdown: string;
	evaluation_rationale: string;
	priority: number;
	status: string;
	target_publish_date: string;
	target_expiry_date: string;
	expires_at: string;
	created_at: string;
	updated_at: string;
}

/**
 * DTO para la respuesta del banco de ideas
 */
export interface GetIdeaBankResponseDto {
	ideas: IdeaDto[];
	total: number;
	limit: number;
	offset: number;
}

/**
 * DTO para actualizar el estado de una idea
 * Maps to: PUT /linda/idea-bank/{id}
 */
export interface UpdateIdeaStatusRequestDto {
	status: string;
}

/**
 * DTO para la respuesta de GET /linda/idea-bank/{id}
 * Incluye campos de estado de generación de contenido
 */
export interface GetIdeaByIdResponseDto extends IdeaDto {
	content_generation_status?: string;
	content_generation_id?: string;
}
