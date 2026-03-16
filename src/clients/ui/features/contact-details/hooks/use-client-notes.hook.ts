import { GetClientNotesUseCase } from "@clients/application/get-client-notes.usecase";
import type { INote } from "@clients/domain/interfaces/note.interface";
import { ClientHistoryAdapter } from "@clients/infrastructure/adapters/client-history.adapter";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_LIMIT = 10;

interface UseClientNotesResponse {
	notes: INote[];
	total: number;
	limit: number;
	offset: number;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	/** Carga la página con el offset indicado (paginación) */
	goToPage: (nextOffset: number) => Promise<void>;
	/** Si hay más notas para cargar según total y offset actual */
	hasMore: boolean;
}

/**
 * React hook that retrieves paginated notes for a specific client by ID.
 * Exposes notes, total, limit, offset and goToPage for pagination UI.
 */
export const useClientNotes = (
	clientId: string | null,
	shouldFetch = true,
	limit = DEFAULT_LIMIT
): UseClientNotesResponse => {
	const [notes, setNotes] = useState<INote[]>([]);
	const [total, setTotal] = useState(0);
	const [offset, setOffset] = useState(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const useCaseRef = useRef<GetClientNotesUseCase | null>(null);
	const currentRequestRef = useRef<string | null>(null);

	if (!useCaseRef.current) {
		const adapter = new ClientHistoryAdapter();
		useCaseRef.current = new GetClientNotesUseCase(adapter);
	}

	const fetchNotes = useCallback(
		async (pageOffset: number = 0) => {
			if (!clientId || !shouldFetch) {
				setNotes([]);
				setTotal(0);
				setOffset(0);
				setIsLoading(false);
				setError(null);
				return;
			}

			const requestId = `${clientId}-${pageOffset}-${Date.now()}`;
			currentRequestRef.current = requestId;

			try {
				setIsLoading(true);
				setError(null);

				const result = await useCaseRef.current?.execute(clientId, {
					limit,
					offset: pageOffset,
				});
				if (!result) {
					throw new Error("UseCase not initialized");
				}

				if (currentRequestRef.current === requestId) {
					setNotes(result.notes);
					setTotal(result.total);
					setOffset(result.offset);
					setIsLoading(false);
				}
			} catch (err) {
				if (currentRequestRef.current === requestId) {
					setError(err as Error);
					setNotes([]);
					setTotal(0);
					setOffset(0);
					setIsLoading(false);
				}
			}
		},
		[clientId, shouldFetch, limit]
	);

	useEffect(() => {
		fetchNotes(0);
	}, [fetchNotes]);

	const refetch = useCallback(async () => {
		await fetchNotes(offset);
	}, [fetchNotes, offset]);

	const goToPage = useCallback(
		async (nextOffset: number) => {
			await fetchNotes(nextOffset);
		},
		[fetchNotes]
	);

	const hasMore = offset + notes.length < total;

	return {
		notes,
		total,
		limit,
		offset,
		isLoading,
		error,
		refetch,
		goToPage,
		hasMore,
	};
};
