import type { IContentGeneration } from "../domain/interfaces/content-generation.interface";
import type {
	CreateContentGenerationRequest,
	IContentGenerationRepository,
} from "../domain/ports/content-generation.port";

/**
 * Use case: Create a new content generation with Linda AI
 *
 * @param repository - Content generation repository implementation
 * @param request - Request containing user input and thread ID
 * @returns Promise with the created content generation
 */
export async function createContentGeneration(
	repository: IContentGenerationRepository,
	request: CreateContentGenerationRequest
): Promise<IContentGeneration> {
	return await repository.createContentGeneration(request);
}
