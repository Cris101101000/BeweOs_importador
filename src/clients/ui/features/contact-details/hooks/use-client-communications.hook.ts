import { GetClientCommunicationsUseCase } from "@clients/application/get-client-communications.usecase";
import type { ICommunication } from "@clients/domain/interfaces/communication.interface";
import { ClientHistoryAdapter } from "@clients/infrastructure/adapters/client-history.adapter";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseClientCommunicationsResponse {
	communications: ICommunication[];
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

/**
 * React hook that retrieves communications for a specific client by ID
 * Simplified implementation to avoid race conditions from useClientDataFetch
 */
export const useClientCommunications = (
	clientId: string | null,
	shouldFetch = true
): UseClientCommunicationsResponse => {
	const [communications, setCommunications] = useState<ICommunication[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	// Use refs to prevent re-creation and race conditions
	const useCaseRef = useRef<GetClientCommunicationsUseCase | null>(null);
	const currentRequestRef = useRef<string | null>(null);

	// Initialize useCase only once
	if (!useCaseRef.current) {
		const adapter = new ClientHistoryAdapter();
		useCaseRef.current = new GetClientCommunicationsUseCase(adapter);
	}

	const fetchCommunications = useCallback(async () => {
		// Reset if no required IDs or shouldn't fetch
		if (!clientId || !shouldFetch) {
			setCommunications([]);
			setIsLoading(false);
			setError(null);
			return;
		}

		// Prevent race conditions
		const requestId = `${clientId}-${Date.now()}`;
		currentRequestRef.current = requestId;

		try {
			setIsLoading(true);
			setError(null);

			const result = await useCaseRef.current?.execute(clientId);
			if (!result) {
				throw new Error("UseCase not initialized");
			}

			// Only update if this is still the current request
			if (currentRequestRef.current === requestId) {
				setCommunications(result);
				setIsLoading(false);
			}
		} catch (err) {
			// Only update if this is still the current request
			if (currentRequestRef.current === requestId) {
				setError(err as Error);
				setCommunications([]);
				setIsLoading(false);
			}
		}
	}, [clientId, shouldFetch]);

	// Fetch on mount and when dependencies change
	useEffect(() => {
		fetchCommunications();
	}, [fetchCommunications]);

	const refetch = useCallback(async () => {
		await fetchCommunications();
	}, [fetchCommunications]);

	return { communications, isLoading, error, refetch };
};
