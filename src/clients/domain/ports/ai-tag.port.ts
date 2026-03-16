import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";

/**
 * Filter options for AI tags query
 */
export interface IAiTagFilterOptions {
	/**
	 * Optional title filter for searching tags
	 */
	title?: string;
}

/**
 * AI Tag Repository Port
 *
 * Defines the contract for AI tag data operations.
 * This port will be implemented by infrastructure adapters.
 */
export interface IAiTagPort {
	/**
	 * Retrieves all AI tags based on filter options
	 *
	 * @param options - Optional filter options (title for search)
	 * @returns Promise with AI tags response
	 */
	getAiTags(options?: IAiTagFilterOptions): Promise<IAiTag[]>;

	/**
	 * Creates a new AI tag
	 *
	 * @param tagData - Data for the new AI tag
	 * @returns Promise with the created AI tag
	 */
	createAiTag(clientId: string, tagData: Partial<IAiTag>): Promise<IAiTag>;

	/**
	 * Deletes an AI tag by ID
	 *
	 * @param id - Unique identifier of the AI tag
	 * @returns Promise with boolean indicating success
	 */
	deleteAiTag(id: string): Promise<boolean>;
}
