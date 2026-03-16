import { useCallback, useEffect, useMemo, useState } from "react";
import { GetCatalogItemsUseCase } from "../../application/get-catalog-items.usecase";
import type { ICatalogFilters } from "../../domain/interfaces/catalog-filter.interface";
import type { ICatalogResponse } from "../../domain/interfaces/catalog.interface";
import { CatalogAdapter } from "../../infrastructure/adapters/catalog.adapter";

interface UseCatalogItemsByFilterResponse {
	result: ICatalogResponse | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	setFilters: (filters: ICatalogFilters | undefined) => void;
	getPage: (page: number, pageSize?: number) => void;
}

/**
 * React hook that retrieves catalog items by filters using the application use case
 * and exposes loading, error state, and filter management.
 */
export const useCatalogItemsByFilter = (
	initialFilters?: ICatalogFilters
): UseCatalogItemsByFilterResponse => {
	const [result, setResult] = useState<ICatalogResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [filters, setFilters] = useState<ICatalogFilters | undefined>(
		initialFilters
	);

	const useCase = useMemo(() => {
		const adapter = new CatalogAdapter();
		return new GetCatalogItemsUseCase(adapter);
	}, []);

	const fetchCatalogItems = useCallback(async () => {
		let isActive = true;

		try {
			setIsLoading(true);
			setError(null);

			const fetchResult = await useCase.execute(filters);
			if (isActive) {
				setResult(fetchResult);
			}
		} catch (err) {
			if (isActive) {
				setError(err as Error);
				setResult(null);
			}
		} finally {
			if (isActive) {
				setIsLoading(false);
			}
		}

		// Return cleanup function
		return () => {
			isActive = false;
		};
	}, [filters, useCase]);

	const refetch = useCallback(async () => {
		await fetchCatalogItems();
	}, [fetchCatalogItems]);

	const updateFilters = useCallback(
		(newFilters: ICatalogFilters | undefined) => {
			setFilters(newFilters);
		},
		[]
	);

	// Helper method to get catalog items by page (for UI convenience)
	const getPage = useCallback(
		(page: number, pageSize = 10) => {
			const offset = (page - 1) * pageSize;
			setFilters((prevFilters) => ({
				...prevFilters,
				offset,
				limit: pageSize,
			}));
		},
		[]
	);

	// Fetch catalog items when filters change
	useEffect(() => {
		fetchCatalogItems();
	}, [fetchCatalogItems]);

	return {
		result,
		isLoading,
		error,
		refetch,
		setFilters: updateFilters,
		getPage,
	};
};
