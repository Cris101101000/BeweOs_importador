import type { Result } from "@shared/domain/errors/Result";
import type {
	IGetChatSessionsRequest,
	IGetChatSessionsResponse,
} from "@clients/domain/interfaces/chat-session.interface";

export interface IChatSessionPort {
	getChatSessions(
		request: IGetChatSessionsRequest
	): Promise<Result<IGetChatSessionsResponse>>;
}
