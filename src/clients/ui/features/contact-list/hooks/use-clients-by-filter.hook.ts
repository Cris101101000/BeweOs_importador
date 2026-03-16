import { GetClientsByFilterUseCase } from "@clients/application/get-clients-by-filter.usecase";
import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import type { IClientResponse } from "@clients/domain/interfaces/client.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseClientsByFilterResponse {
	result: IClientResponse | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	setFilters: (filters: IClientFilter | undefined) => void;
	getPage: (page: number, pageSize?: number) => void;
}

/**
 * React hook that retrieves clients by filters using the application use case
 * and exposes loading, error state, and filter management.
 */
export const useClientsByFilter = (
	initialFilters?: IClientFilter
): UseClientsByFilterResponse => {
	const [result, setResult] = useState<IClientResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [filters, setFilters] = useState<IClientFilter | undefined>(
		initialFilters
	);

	const useCase = useMemo(() => {
		const adapter = new ClientAdapter();
		return new GetClientsByFilterUseCase(adapter);
	}, []);

	const fetchClients = useCallback(async () => {
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
		await fetchClients();
	}, [fetchClients]);

	const updateFilters = useCallback((newFilters: IClientFilter | undefined) => {
		setFilters(newFilters);
	}, []);

	// Helper method to get clients by page (for UI convenience)
	const getPage = useCallback(
		(page: number, pageSize = 20) => {
			const offset = (page - 1) * pageSize;
			setFilters({
				...filters,
				offset,
				limit: pageSize,
			});
		},
		[filters]
	);

	// Fetch clients when filters change
	useEffect(() => {
		fetchClients();
	}, [fetchClients]);

	return {
		result,
		isLoading,
		error,
		refetch,
		setFilters: updateFilters,
		getPage,
	};
};
