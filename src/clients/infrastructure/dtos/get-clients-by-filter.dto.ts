import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";

/**
 * Request DTO that matches the API Gateway query parameters
 * Example: /clients?limit=20&offset=0&tags=alexa&tags=creer&status=ACTIVE
 */
export interface GetClientsByFilterRequestDto {
	// Pagination
	limit?: number; // min 1
	offset?: number; // min 0
	order?: string; // field name for sorting (e.g., 'name', '-createdAt')
	// Search
	search?: string; // For name, email, business search (URL encoded)
	// Date filters (ISO strings)
	createdFrom?: string; // ISO date string
	createdTo?: string; // ISO date string
	birthdateFrom?: string; // ISO date string
	birthdateTo?: string; // ISO date string
	lastCommunicationFrom?: string; // ISO date string
	lastCommunicationTo?: string; // ISO date string
	// Array filters
	status?: EnumClientStatus[];
	potentialTier?: string[]; // 'low', 'medium', 'high'
	tags?: string[]; // Tag titles to filter by (e.g., ['alexa', 'creer'])
}
