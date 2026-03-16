import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type { IAiTagPort } from "../../domain/ports/ai-tag.port";

/**
 * Create AI Tag Use Case
 *
 * Simple use case for creating AI tags.
 */
export class CreateAiTagUseCase {
	constructor(private readonly aiTagPort: IAiTagPort) {}

	/**
	 * Creates a new AI tag
	 *
	 * @param clientId - Client ID
	 * @param tagData - AI tag data (at minimum, must contain value)
	 * @returns Promise with the created AI tag
	 */
	async execute(clientId: string, tagData: Partial<IAiTag>): Promise<IAiTag> {
		// Validate that value is provided and not empty
		if (!tagData.value?.trim()) {
			throw new Error("ai_tag_value_cannot_be_empty");
		}

		// Clean and normalize the tag data
		const cleanTagData: Partial<IAiTag> = {
			...tagData,
			value: tagData.value.trim(),
			color: tagData.color || "#f4f4f5",
		};

		return await this.aiTagPort.createAiTag(clientId, cleanTagData);
	}
}
