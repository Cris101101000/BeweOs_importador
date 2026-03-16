import type {
	IContentGenerationRepository,
	EditImageResult,
} from "../domain/ports/content-generation.port";

/**
 * Use case: Edit image in content generation with Linda AI
 *
 * @param repository - Content generation repository implementation
 * @param id - Content generation ID
 * @param prompt - Description of how to edit the image
 * @param imageUrls - Optional array of reference image URLs
 * @returns Promise with updated content and optional new image URL (when API returns data.new_url)
 */
export async function editImage(
	repository: IContentGenerationRepository,
	id: string,
	prompt: string,
	imageUrls?: string[]
): Promise<EditImageResult> {
	return await repository.editImage(id, prompt, imageUrls);
}

