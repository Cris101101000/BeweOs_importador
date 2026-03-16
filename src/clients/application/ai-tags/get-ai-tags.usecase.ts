import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type {
	IAiTagFilterOptions,
	IAiTagPort,
} from "../../domain/ports/ai-tag.port";

/**
 * Get AI Tags Use Case
 *
 * Simple use case for retrieving AI tags.
 */
export class GetAiTagsUseCase {
	constructor(private readonly aiTagPort: IAiTagPort) {}

	/**
	 * Gets AI tags with optional filtering
	 *
	 * @param options - Optional filter options (title for search)
	 * @returns Promise with AI tags array
	 */
	async execute(options?: IAiTagFilterOptions): Promise<IAiTag[]> {
		return await this.aiTagPort.getAiTags(options);
	}
}
