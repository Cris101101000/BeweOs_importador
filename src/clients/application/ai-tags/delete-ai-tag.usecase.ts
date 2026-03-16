import type { IAiTagPort } from "../../domain/ports/ai-tag.port";

/**
 * Delete AI Tag Use Case
 *
 * Simple use case for deleting AI tags.
 */
export class DeleteAiTagUseCase {
	constructor(private readonly aiTagPort: IAiTagPort) {}

	/**
	 * Deletes an AI tag
	 *
	 * @param id - AI tag ID
	 * @returns Promise with boolean indicating success
	 */
	async execute(id: string): Promise<boolean> {
		return await this.aiTagPort.deleteAiTag(id);
	}
}
