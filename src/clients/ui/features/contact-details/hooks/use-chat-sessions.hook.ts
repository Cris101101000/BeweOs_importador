import { useState, useEffect, useCallback } from "react";
import type {
	IChatSession,
	IGetChatSessionsRequest,
	ChatSessionStatus,
} from "@clients/domain/interfaces/chat-session.interface";
import { GetChatSessionsUseCase } from "@clients/application/get-chat-sessions.usecase";
import { ChatSessionAdapter } from "@clients/infrastructure/adapters/chat-session.adapter";
import { useSession } from "@shared/ui/contexts/session-context/session-context";

const adapter = new ChatSessionAdapter();
const getChatSessionsUseCase = new GetChatSessionsUseCase(adapter);

interface UseChatSessionsOptions {
	autoFetch?: boolean;
	limit?: number;
	page?: number;
	defaultStatus?: ChatSessionStatus[];
}

export const useChatSessions = (
	clientId: string | null,
	options: UseChatSessionsOptions = {}
) => {
	const {
		autoFetch = true,
		limit = 20,
		page = 1,
		defaultStatus,
	} = options;
	const { agency } = useSession();

	const [chatSessions, setChatSessions] = useState<IChatSession[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(page);

	const fetchChatSessions = useCallback(
		async (request?: Partial<IGetChatSessionsRequest>) => {
			if (!clientId) {
				setChatSessions([]);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const result = await getChatSessionsUseCase.execute({
					agencyId: agency?.id,
					clientId,
					limit,
					page: currentPage,
					status: defaultStatus,
					...request,
				});

				if (result.isSuccess && result.value) {
					const data = result.value;
					setChatSessions(data.chatSessions);
					setTotalCount(data.totalCount);
					setCurrentPage(data.page);
				} else if (result.error) {
					setError(result.error);
					setChatSessions([]);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Unknown error occurred")
				);
				setChatSessions([]);
			} finally {
				setIsLoading(false);
			}
		},
		[clientId, agency?.id, limit, currentPage]
	);

	const filterByStatus = useCallback(
		(status?: ChatSessionStatus[]) => {
			fetchChatSessions({ status });
		},
		[fetchChatSessions]
	);

	const goToPage = useCallback(
		(newPage: number) => {
			setCurrentPage(newPage);
			fetchChatSessions({ page: newPage });
		},
		[fetchChatSessions]
	);

	useEffect(() => {
		if (autoFetch) {
			fetchChatSessions();
		}
	}, [autoFetch, fetchChatSessions]);

	return {
		chatSessions,
		isLoading,
		error,
		totalCount,
		currentPage,
		refetch: fetchChatSessions,
		filterByStatus,
		goToPage,
	};
};
