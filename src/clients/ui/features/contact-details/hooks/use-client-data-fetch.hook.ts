/**
 * Generic hook for fetching client-related data
 * Eliminates code duplication across client data hooks
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface UseClientDataFetchOptions<T> {
	clientId: string | null;
	fetchFunction: (clientId: string) => Promise<T>;
	initialData: T;
	resetOnClientChange?: boolean;
}

interface UseClientDataFetchResponse<T> {
	data: T;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

/**
 * Generic hook for fetching client-related data with consistent error handling,
 * loading states, and race condition prevention
 */
export const useClientDataFetch = <T>({
	clientId,
	fetchFunction,
	initialData,
	resetOnClientChange = true,
}: UseClientDataFetchOptions<T>): UseClientDataFetchResponse<T> => {
	const [data, setData] = useState<T>(initialData);
	const [isLoading, setIsLoading] = useState<boolean>(!!clientId);
	const [error, setError] = useState<Error | null>(null);

	// Use ref to track current request for race condition prevention
	const currentRequestRef = useRef<string | null>(null);

	// Effect for fetching data
	useEffect(() => {
		// Track if this effect instance is still active (not cleaned up)
		let isActive = true;

		const fetchData = async () => {
			if (!clientId) {
				if (resetOnClientChange) {
					setData(initialData);
				}
				setIsLoading(false);
				setError(null);
				return;
			}

			// Create unique request ID to handle race conditions for data updates
			const requestId = `${clientId}-${Date.now()}`;
			currentRequestRef.current = requestId;

			try {
				setIsLoading(true);
				setError(null);

				const result = await fetchFunction(clientId);

				// Only update data if this effect is still active and it's the current request
				// This prevents stale data from overwriting newer data
				if (isActive && currentRequestRef.current === requestId) {
					setData(result);
					setIsLoading(false);
				}
			} catch (err) {
				// Only update error if this effect is still active and it's the current request
				if (isActive && currentRequestRef.current === requestId) {
					setError(err as Error);
					if (resetOnClientChange) {
						setData(initialData);
					}
					setIsLoading(false);
				}
			}
		};

		fetchData();

		// Cleanup function: mark this effect instance as inactive
		return () => {
			isActive = false;
		};
	}, [clientId, fetchFunction, initialData, resetOnClientChange]);

	const refetch = useCallback(async () => {
		if (!clientId) return;

		const requestId = `${clientId}-${Date.now()}`;
		currentRequestRef.current = requestId;

		try {
			setIsLoading(true);
			setError(null);

			const result = await fetchFunction(clientId);

			if (currentRequestRef.current === requestId) {
				setData(result);
				setIsLoading(false);
			}
		} catch (err) {
			if (currentRequestRef.current === requestId) {
				setError(err as Error);
				setIsLoading(false);
			}
		}
	}, [clientId, fetchFunction]);

	return { data, isLoading, error, refetch };
};
