/**
 * DTO for Content Generation from API response
 * Maps to: GET /linda/content-generation
 */
export interface ContentGenerationDto {
	id: string;
	name: string;
	type: string;
	category: string;
	language: string;
	content_type: string;
	variables: string;
	blocks: string;
	agency_id: string;
	agency_name: string;
	company_id: string;
	company_name: string;
	generated_assets: string;
	status: string;
	origin?: string;
	error_details?: string;
	created_at: string;
	updated_at: string;
	published_at?: string;
}

export interface GetContentGenerationsResponseDto {
	total: number;
	page: number;
	limit: number;
	total_pages: number;
	data: ContentGenerationDto[];
}

/**
 * DTO for creating content generation
 * Maps to: POST /linda/content-generation
 */
export interface CreateContentGenerationRequestDto {
	user_input: string;
	thread_id: string;
	/** false para usar el logo por default, true para usar uno enviado por el usuario */
	force_use_logo?: boolean;
	/** URL de filestack del nuevo logo */
	temporal_logo_url?: string;
	/** Nueva descripción de marca que digitó el usuario */
	temporal_visual_style?: string;
	/** Color primario que el usuario customizó */
	temporal_primary_color?: string;
	/** Color secundario que el usuario customizó */
	temporal_secondary_color?: string;
}

export interface CreateContentGenerationResponseDto {
	success: boolean;
	message: string;
	data: ContentGenerationDto;
	timestamp: string;
}

/**
 * DTO for editing image in content generation
 * Maps to: PUT /linda/content-generation/{id}/edit-image
 */
export interface EditImageRequestDto {
	prompt: string;
	additional_reference_urls?: string[];
}

export interface EditImageResponseDataDto extends ContentGenerationDto {
	new_url?: string;
}

export interface EditImageResponseDto {
	success: boolean;
	message: string;
	data: EditImageResponseDataDto;
	timestamp: string;
}
