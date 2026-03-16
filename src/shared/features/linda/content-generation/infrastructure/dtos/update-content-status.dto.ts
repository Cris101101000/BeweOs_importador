/**
 * DTO for updating content generation status
 * Maps to: PUT /linda/content-generation/{id}/status
 */
export interface UpdateContentStatusRequestDto {
	status: string;
}

export interface UpdateContentStatusResponseDto {
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
	error_details?: string;
	created_at: string;
	updated_at: string;
	published_at?: string;
}
