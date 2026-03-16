/**
 * DTOs para la respuesta de GET /channels/messages (ítems con content.blocks).
 * Usado por assistant_suggestion (dashboard) y por notification panel (layout).
 */

export interface ContentBlockActionDto {
	type: string;
	title?: string;
	body?: string;
	url?: string;
	[key: string]: unknown;
}

export interface ContentBlockDto {
	type: string;
	body?: string;
	actions?: ContentBlockActionDto[];
	[key: string]: unknown;
}

export interface MessageContentDto {
	contentType?: string;
	blocks?: ContentBlockDto[];
	[key: string]: unknown;
}

/** Ítem de la respuesta GET /channels/messages (data.items[]) */
export interface ChannelMessageDto {
	id: string;
	type: string;
	category?: string;
	content?: MessageContentDto;
	[key: string]: unknown;
}