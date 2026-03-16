import { useCallback, useEffect, useState } from "react";
import { DeleteSmartTagsUseCase } from "../../application/delete-smart-tags.usecase.ts";
import { ManageSmartTagsUseCase } from "../../application/manage-smart-tags.usecase.ts";
import { SmartTagStatus } from "../../domain/enums/smart-tag-status.enum";
import type {
	ISmartTag,
	ISmartTagsPagination,
} from "../../domain/interfaces/smart-tags-interface.ts";
import { SmartTagAdapter } from "../../infrastructure/adapters/smart-tags.adapter.ts";
import type { SmartTagsFilters } from "../../infrastructure/adapters/smart-tags.adapter.ts";

const smartTagRepository = new SmartTagAdapter();
const manageSmartTagsUseCase = new ManageSmartTagsUseCase(smartTagRepository);
const deleteSmartTagsUseCase = new DeleteSmartTagsUseCase(smartTagRepository);

const DEFAULT_PAGINATION: ISmartTagsPagination = {
	page: 1,
	limit: 10,
	total: 0,
	totalPages: 0,
};

export const useSmartTags = (filters?: SmartTagsFilters) => {
	const [smartTags, setSmartTags] = useState<ISmartTag[]>([]);
	const [pagination, setPagination] =
		useState<ISmartTagsPagination>(DEFAULT_PAGINATION);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadAll = useCallback(
		async (customFilters?: SmartTagsFilters) => {
			setIsLoading(true);
			setError(null);
			try {
				const filtersToUse: SmartTagsFilters = {
					...(customFilters || filters),
				};
				// Get smart tags with pagination info
				const response =
					await manageSmartTagsUseCase.getSmartTags(filtersToUse);
				setSmartTags(response.items);
				setPagination(response.pagination);

				// DEBUG: Log pagination info
				console.log("🏷️ HOOK: Loaded smart tags with pagination:", {
					itemsCount: response.items.length,
					pagination: response.pagination,
				});
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error loading smart tags data"
				);
			} finally {
				setIsLoading(false);
			}
		},
		[filters]
	);

	const createSmartTag = async (
		tag: Omit<ISmartTag, "id" | "createdAt" | "updatedAt" | "usageCount">
	) => {
		setIsLoading(true);
		setError(null);
		try {
			const newTag = await manageSmartTagsUseCase.createSmartTag({
				...tag,
				usageCount: 0,
			});
			setSmartTags((prev) => [...prev, newTag]);
			return newTag;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error creating smart tag");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const updateSmartTag = async (id: string, updates: Partial<ISmartTag>) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedTag = await manageSmartTagsUseCase.updateSmartTag(
				id,
				updates
			);
			setSmartTags((prev) =>
				prev.map((tag) => (tag.id === id ? updatedTag : tag))
			);
			return updatedTag;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error updating smart tag");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteSmartTag = async (id: string) => {
		console.log(`🚀 HOOK: deleteSmartTag called with id:`, id);
		setIsLoading(true);
		setError(null);
		try {
			await manageSmartTagsUseCase.deleteSmartTag(id);
			setSmartTags((prev) => prev.filter((tag) => tag.id !== id));
			console.log(`✅ HOOK: Tag deleted successfully, removed from state`);
		} catch (err) {
			console.error(`❌ HOOK: Error deleting smart tag:`, err);
			setError(err instanceof Error ? err.message : "Error deleting smart tag");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteSmartTags = async (ids: string[]) => {
		if (!ids || ids.length === 0) {
			throw new Error("At least one tag ID is required");
		}

		setIsLoading(true);
		setError(null);
		try {
			// If only one item, use individual delete
			if (ids.length === 1) {
				await manageSmartTagsUseCase.deleteSmartTag(ids[0]);
				setSmartTags((prev) => prev.filter((tag) => tag.id !== ids[0]));
			} else {
				// Use bulk delete endpoint for multiple items
				await deleteSmartTagsUseCase.execute(ids);
				setSmartTags((prev) => prev.filter((tag) => !ids.includes(tag.id)));
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error deleting smart tags"
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const toggleTagStatus = async (id: string) => {
		const tag = smartTags.find((t) => t.id === id);
		if (!tag) return;

		const newStatus =
			tag.status === SmartTagStatus.ACTIVE
				? SmartTagStatus.INACTIVE
				: SmartTagStatus.ACTIVE;

		return updateSmartTag(id, { status: newStatus });
	};

	const getSmartTagById = async (id: string): Promise<ISmartTag | null> => {
		setIsLoading(true);
		setError(null);
		try {
			const tag = await manageSmartTagsUseCase.getSmartTagById(id);
			return tag;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error fetching smart tag");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadAll();
	}, [loadAll]);

	return {
		smartTags,
		pagination,
		isLoading,
		error,
		createSmartTag,
		updateSmartTag,
		deleteSmartTag,
		deleteSmartTags,
		toggleTagStatus,
		getSmartTagById,
		reload: loadAll,
	};
};
