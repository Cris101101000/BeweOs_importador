import { CreateAiTagUseCase } from "@clients/application/ai-tags/create-ai-tag.usecase";
import { DeleteAiTagUseCase } from "@clients/application/ai-tags/delete-ai-tag.usecase";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import { AiTagAdapter } from "@clients/infrastructure/adapters/ai-tag.adapter";
import { toAiTagsFromSmartTags } from "@clients/infrastructure/mappers/smart-tag-to-ai-tag.mapper";
import { useCallback, useEffect, useState } from "react";
import { SmartTagAdapter } from "@smart-tags/infrastructure/adapters/smart-tags.adapter";

/**
 * Hook to fetch and manage AI tags with proper caching
 *
 * This hook:
 * - Fetches smart tags from the API filtered by CLIENTS entity and ACTIVE status
 * - Provides loading state and error handling
 * - Caches the results to prevent unnecessary refetches
 */
export const useAiTags = () => {
	const [aiTags, setAiTags] = useState<IAiTag[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	/**
	 * Fetch smart tags from the API filtered by CLIENTS entity and ACTIVE status
	 */
	const fetchAiTags = useCallback(async () => {
		if (isInitialized) {
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const smartTagAdapter = new SmartTagAdapter();

			// Fetch smart tags filtered by CLIENTS entity and ACTIVE status
			// Status must be uppercase for the API
			const { items: smartTags } = await smartTagAdapter.getSmartTags({
				status: "ACTIVE",
				applicableEntities: ["CLIENT"],
			});

			// Map ISmartTag[] to IAiTag[]
			const tags = toAiTagsFromSmartTags(smartTags);
			setAiTags(tags);
			setIsInitialized(true);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Error fetching AI tags";
			setError(errorMessage);
			console.error("Error fetching AI tags:", err);
		} finally {
			setIsLoading(false);
		}
	}, [isInitialized]);

	/**
	 * Refresh AI tags (can be used to force a reload)
	 */
	const refreshAiTags = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const smartTagAdapter = new SmartTagAdapter();

			// Fetch smart tags filtered by CLIENTS entity and ACTIVE status
			// Status must be uppercase for the API
			const { items: smartTags } = await smartTagAdapter.getSmartTags({
				status: "ACTIVE",
				applicableEntities: ["CLIENT"],
			});

			// Map ISmartTag[] to IAiTag[]
			const tags = toAiTagsFromSmartTags(smartTags);
			setAiTags(tags);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Error refreshing AI tags";
			setError(errorMessage);
			console.error("Error refreshing AI tags:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Create a new AI tag
	 */
	const createTag = useCallback(
		async (
			clientId: string,
			tagData: Partial<IAiTag>
		): Promise<IAiTag | null> => {
			const aiTagAdapter = new AiTagAdapter();
			const createAiTagUseCase = new CreateAiTagUseCase(aiTagAdapter);

			const newTag = await createAiTagUseCase.execute(clientId, tagData);

			// Add the new tag to the current list
			setAiTags((prevTags) => [...prevTags, newTag]);

			return newTag;
		},
		[]
	);

	/**
	 * Delete an AI tag
	 */
	const deleteTag = useCallback(async (tagId: string): Promise<boolean> => {
		if (!tagId) {
			return false;
		}
		console.log("Deleting tag:", tagId);
		const aiTagAdapter = new AiTagAdapter();
		const deleteAiTagUseCase = new DeleteAiTagUseCase(aiTagAdapter);

		const success = await deleteAiTagUseCase.execute(tagId);

		if (success) {
			// Remove the tag from the current list
			setAiTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
		}

		return success;
	}, []);

	/**
	 * Effect to fetch AI tags when agency is available
	 */
	useEffect(() => {
		fetchAiTags();
	}, [fetchAiTags]);

	return {
		aiTags,
		isLoading,
		error,
		refreshAiTags,
		isInitialized,
		createTag,
		deleteTag,
	};
};
