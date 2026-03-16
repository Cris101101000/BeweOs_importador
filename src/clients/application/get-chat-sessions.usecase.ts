import type { Result } from "@shared/domain/errors/Result";
import type {
	IGetChatSessionsRequest,
	IGetChatSessionsResponse,
} from "@clients/domain/interfaces/chat-session.interface";
import type { IChatSessionPort } from "@clients/domain/ports/chat-session.port";

export class GetChatSessionsUseCase {
	constructor(private readonly chatSessionPort: IChatSessionPort) {}

	async execute(
		request: IGetChatSessionsRequest
	): Promise<Result<IGetChatSessionsResponse>> {
		return await this.chatSessionPort.getChatSessions(request);
	}
}
