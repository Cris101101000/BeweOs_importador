import { useCallback, useEffect, useState } from "react";
import { ManageQuickStartsUseCase } from "../../../../application/quick-starts";
import type { QuickStart } from "../../../../domain/quick-starts/interfaces";
import { QuickStartsAdapter } from "../../../../infrastructure/quick-start/adapters/quick-starts.adapter";

const quickStartsRepository = new QuickStartsAdapter();
const manageQuickStartsUseCase = new ManageQuickStartsUseCase(
	quickStartsRepository
);

export const useQuickStarts = () => {
	const [quickStarts, setQuickStarts] = useState<QuickStart[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadQuickStarts = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await manageQuickStartsUseCase.getQuickStarts();
			setQuickStarts(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error loading quick starts"
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createQuickStart = async (
		quickStart: Omit<QuickStart, "id" | "createdAt">
	) => {
		setIsLoading(true);
		setError(null);
		try {
			const newQuickStart =
				await manageQuickStartsUseCase.createQuickStart(quickStart);
			setQuickStarts((prev) => [...prev, newQuickStart]);
			return newQuickStart;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error creating quick start"
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const updateQuickStart = async (
		id: string,
		quickStart: Partial<QuickStart>
	) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedQuickStart = await manageQuickStartsUseCase.updateQuickStart(
				id,
				quickStart
			);
			setQuickStarts((prev) =>
				prev.map((qs) => (qs.id === id ? updatedQuickStart : qs))
			);
			return updatedQuickStart;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error updating quick start"
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteQuickStart = async (id: string) => {
		setIsLoading(true);
		setError(null);
		try {
			await manageQuickStartsUseCase.deleteQuickStart(id);
			setQuickStarts((prev) => prev.filter((qs) => qs.id !== id));
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error deleting quick start"
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const toggleQuickStartActive = async (id: string, isActive: boolean) => {
		setError(null);
		try {
			const updatedQuickStart =
				await manageQuickStartsUseCase.toggleQuickStartActive(id, isActive);
			setQuickStarts((prev) =>
				prev.map((qs) => (qs.id === id ? updatedQuickStart : qs))
			);
			return updatedQuickStart;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error toggling quick start status"
			);
			throw err;
		}
	};

	useEffect(() => {
		loadQuickStarts();
	}, [loadQuickStarts]);

	return {
		quickStarts,
		isLoading,
		error,
		createQuickStart,
		updateQuickStart,
		deleteQuickStart,
		toggleQuickStartActive,
		reload: loadQuickStarts,
	};
};
