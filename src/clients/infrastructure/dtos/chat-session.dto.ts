export interface ToolDto {
	name: string;
	description: string;
}

export interface AgentDto {
	name: string;
	description: string;
}

export interface ChatSessionDto {
	id: string;
	thread_id: string;
	agency_id: string;
	agency_name: string;
	company_id: string;
	company_name: string;
	company_country: string;
	client_id?: string;
	client_name?: string;
	client_email?: string;
	name_assistant: string;
	channel_name: string;
	total_messages: number;
	last_message?: string;
	status: string;
	date_expiration: string;
	is_closed: boolean;
	date_closed?: string;
	tools_used: ToolDto[];
	agents_used: AgentDto[];
	created_at: string;
	updated_at: string;
}

export interface ChatSessionsResponseDto {
	chat_sessions: ChatSessionDto[];
	total_count: number;
	page: number;
	limit: number;
}

export interface GetChatSessionsQueryParams {
	agency_id?: string;
	company_id?: string;
	client_id?: string;
	thread_id?: string;
	status?: string[]; // ["active", "closed", "expired", "awaiting_human"]
	date_start?: string;
	date_end?: string;
	limit?: number;
	page?: number;
}
