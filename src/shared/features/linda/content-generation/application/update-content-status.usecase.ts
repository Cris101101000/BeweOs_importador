import { ContentGenerationStatus } from "../domain/enums/content-generation-status.enum";
import type { IContentGeneration } from "../domain/interfaces/content-generation.interface";
import type { IContentGenerationRepository } from "../domain/ports/content-generation.port";

/**
 * Use Case: Update Content Generation Status
 * Updates the status of a content generation (completed → published/deleted)
 *
 * @param repository - Content generation repository instance
 * @param id - Content generation ID
 * @param status - New status to set
 * @returns Promise with updated content generation
 */
export async function updateContentStatus(
	repository: IContentGenerationRepository,
	id: string,
	status: ContentGenerationStatus
): Promise<IContentGeneration> {
	// Validate inputs
	if (!id || id.trim() === "") {
		throw new Error("Content generation ID is required");
	}

	if (!Object.values(ContentGenerationStatus).includes(status)) {
		throw new Error(`Invalid status: ${status}`);
	}

	return await repository.updateContentGenerationStatus(id, status);
}
