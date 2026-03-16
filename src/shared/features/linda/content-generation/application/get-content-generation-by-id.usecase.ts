import type { IContentGeneration } from "../domain/interfaces/content-generation.interface";
import type { IContentGenerationRepository } from "../domain/ports/content-generation.port";

/**
 * Use Case: Get Content Generation By ID
 * Retrieves a specific content generation by its ID
 *
 * @param repository - Content generation repository instance
 * @param id - Content generation ID
 * @returns Promise with content generation or null if not found
 */
export async function getContentGenerationById(
	repository: IContentGenerationRepository,
	id: string
): Promise<IContentGeneration | null> {
	if (!id || id.trim() === "") {
		throw new Error("Content generation ID is required");
	}

	return await repository.getContentGenerationById(id);
}
