import { Result } from "@shared/domain/errors/Result";
import { httpService } from "@http";
import type {
	IGetChatSessionsRequest,
	IGetChatSessionsResponse,
} from "@clients/domain/interfaces/chat-session.interface";
import type { IChatSessionPort } from "@clients/domain/ports/chat-session.port";
import type { ChatSessionsResponseDto } from "@clients/infrastructure/dtos/chat-session.dto";
import { ChatSessionMapper } from "@clients/infrastructure/mappers/chat-session.mapper";

export class GetChatSessionsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GetChatSessionsError";
	}
}

export class ChatSessionAdapter implements IChatSessionPort {
	async getChatSessions(
		request: IGetChatSessionsRequest
	): Promise<Result<IGetChatSessionsResponse>> {
		try {
			// Construir query params
			const queryParams: Record<string, string | number> = {};

			if (request.agencyId) {
				queryParams.agency_id = request.agencyId;
			}

			if (request.companyId) {
				queryParams.company_id = request.companyId;
			}

			if (request.clientId) {
				queryParams.client_id = request.clientId;
			}

			if (request.threadId) {
				queryParams.thread_id = request.threadId;
			}

			if (request.status && request.status.length > 0) {
				// El backend espera un array de strings
				queryParams.status = request.status.join(",");
			}

			if (request.dateStart) {
				queryParams.date_start = request.dateStart;
			}

			if (request.dateEnd) {
				queryParams.date_end = request.dateEnd;
			}

			if (request.limit) {
				queryParams.limit = request.limit;
			}

			if (request.page) {
				queryParams.page = request.page;
			}

			// Construir URL con query params
			const queryString = new URLSearchParams(
				queryParams as Record<string, string>
			).toString();
			const url = `/linda/chat-sessions${queryString ? `?${queryString}` : ""}`;

			const response =
				await httpService.get<ChatSessionsResponseDto>(url);

			if (response.success && response.data) {
				const domainData = ChatSessionMapper.toDomainList(response.data);
				return Result.Ok(domainData);
			}

			return Result.Err(
				new GetChatSessionsError(
					response.error?.message || "Failed to get chat sessions"
				)
			);
		} catch (error) {
			return Result.Err(
				new GetChatSessionsError(
					error instanceof Error ? error.message : "Unknown error"
				)
			);
		}
	}
}
