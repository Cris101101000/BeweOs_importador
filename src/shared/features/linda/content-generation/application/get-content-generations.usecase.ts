import type { IContentGenerationResponse } from "../domain/interfaces/content-generation.interface";
import type {
	ContentGenerationFilters,
	IContentGenerationRepository,
} from "../domain/ports/content-generation.port";

/**
 * Use Case: Get Content Generations
 * Retrieves a list of content generations with optional filters
 *
 * @param repository - Content generation repository instance
 * @param filters - Optional filters (status, page, limit, language, category)
 * @returns Promise with paginated content generation response
 */
export async function getContentGenerations(
	repository: IContentGenerationRepository,
	filters?: ContentGenerationFilters
): Promise<IContentGenerationResponse> {
	return await repository.getContentGenerations(filters);
}
