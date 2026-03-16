export type ChatSessionStatus = "active" | "closed" | "expired" | "awaiting_human";

export interface IChatSession {
	id: string;
	threadId: string;
	agencyId: string;
	agencyName: string;
	companyId: string;
	companyName: string;
	companyCountry: string;
	clientId?: string;
	clientName?: string;
	clientEmail?: string;
	nameAssistant: string;
	channelName: string;
	totalMessages: number;
	lastMessage?: string;
	dateExpiration: string;
	isClosed: boolean;
	dateClosed?: string;
	status: ChatSessionStatus;
	createdAt: string;
	updatedAt: string;
}

export interface IGetChatSessionsRequest {
	agencyId?: string;
	companyId?: string;
	clientId?: string;
	threadId?: string;
	status?: ChatSessionStatus[];
	dateStart?: string;
	dateEnd?: string;
	limit?: number;
	page?: number;
}

export interface IGetChatSessionsResponse {
	chatSessions: IChatSession[];
	totalCount: number;
	page: number;
	limit: number;
}
