import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import { toAiTagsFromSmartTags } from "@clients/infrastructure/mappers/smart-tag-to-ai-tag.mapper";
import { SmartTagAdapter } from "@smart-tags/infrastructure/adapters/smart-tags.adapter";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook for managing AI tags
 *
 * Provides functionality to:
 * - Fetch AI tags from backend using SmartTagAdapter
 * - Handle loading and error states
 * - Support optional title search filter
 *
 * Uses endpoint: GET /tags?applicableEntities=CLIENT&status=ACTIVE&title=...
 *
 * @returns {Object} Hook state and methods
 */
export const useAiTags = () => {
	const [aiTags, setAiTags] = useState<IAiTag[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Fetch AI tags from backend
	 * Uses endpoint: GET /tags?applicableEntities=CLIENT&status=ACTIVE&title=...
	 *
	 * @param title - Optional title filter for searching tags
	 */
	const fetchAiTags = useCallback(async (title?: string) => {
		console.log("[useAiTags] Fetching AI tags...", title ? `with title filter: "${title}"` : "");
		setIsLoading(true);
		setError(null);

		try {
			const smartTagAdapter = new SmartTagAdapter();

			// Fetch smart tags filtered by CLIENT entity and ACTIVE status
			const { items: smartTags } = await smartTagAdapter.getSmartTags({
				status: "ACTIVE",
				applicableEntities: ["CLIENT"],
				title: title?.trim() || undefined,
				limit: 100, // Get all tags for filtering
			});

			// Map ISmartTag[] to IAiTag[]
			const tags = toAiTagsFromSmartTags(smartTags);
			console.log("[useAiTags] AI tags fetched successfully:", tags);
			setAiTags(tags);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch AI tags";
			setError(errorMessage);
			console.error("[useAiTags] Error fetching AI tags:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Automatically fetch AI tags on mount
	 */
	useEffect(() => {
		fetchAiTags();
	}, [fetchAiTags]);

	/**
	 * Convert AI tags to simple string array for compatibility
	 * with existing tag selection components
	 */
	const availableTagValues = useCallback(() => {
		return aiTags.map((tag) => tag.value);
	}, [aiTags]);

	/**
	 * Get AI tag object by value
	 */
	const getTagByValue = useCallback(
		(value: string): IAiTag | undefined => {
			return aiTags.find((tag) => tag.value === value);
		},
		[aiTags]
	);

	/**
	 * Search AI tags by title
	 * @param title - Title to search for
	 */
	const searchByTitle = useCallback(
		(title: string) => {
			fetchAiTags(title);
		},
		[fetchAiTags]
	);

	return {
		aiTags,
		availableTagValues,
		getTagByValue,
		isLoading,
		error,
		refetch: fetchAiTags,
		searchByTitle,
	};
};
