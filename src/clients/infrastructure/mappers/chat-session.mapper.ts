import type {
	IChatSession,
	IGetChatSessionsResponse,
	ChatSessionStatus,
} from "@clients/domain/interfaces/chat-session.interface";
import type {
	ChatSessionDto,
	ChatSessionsResponseDto,
} from "@clients/infrastructure/dtos/chat-session.dto";

const VALID_STATUSES: ChatSessionStatus[] = [
	"active",
	"closed",
	"expired",
	"awaiting_human",
];

export class ChatSessionMapper {
	static toDomain(dto: ChatSessionDto): IChatSession {
		const status = VALID_STATUSES.includes(dto.status as ChatSessionStatus)
			? (dto.status as ChatSessionStatus)
			: "active";

		return {
			id: dto.id,
			threadId: dto.thread_id,
			agencyId: dto.agency_id,
			agencyName: dto.agency_name,
			companyId: dto.company_id,
			companyName: dto.company_name,
			companyCountry: dto.company_country,
			clientId: dto.client_id,
			clientName: dto.client_name,
			clientEmail: dto.client_email,
			nameAssistant: dto.name_assistant,
			channelName: dto.channel_name,
			totalMessages: dto.total_messages,
			lastMessage: dto.last_message,
			dateExpiration: dto.date_expiration,
			isClosed: dto.is_closed,
			dateClosed: dto.date_closed,
			status,
			createdAt: dto.created_at,
			updatedAt: dto.updated_at,
		};
	}

	static toDomainList(dto: ChatSessionsResponseDto): IGetChatSessionsResponse {
		return {
			chatSessions: dto.chat_sessions.map((session) =>
				this.toDomain(session)
			),
			totalCount: dto.total_count,
			page: dto.page,
			limit: dto.limit,
		};
	}
}
