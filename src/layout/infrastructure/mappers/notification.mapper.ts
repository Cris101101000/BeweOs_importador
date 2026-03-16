import type { INotification } from "src/shared/domain/interfaces/notification.interface";

// ─── Shared types ────────────────────────────────────────────────────────────

interface ContentBlock {
	type: string;
	body?: string;
	url?: string;
	actions?: ContentBlockAction[];
	[key: string]: unknown;
}

interface ContentBlockAction {
	type: string;
	title?: string;
	body?: string;
}

interface MessageContent {
	contentType?: string;
	variables?: Array<{ code: string; body: string }>;
	blocks?: ContentBlock[];
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

const VALID_NOTIFICATION_TYPES = ["low", "normal", "high", "urgent"] as const;

/**
 * Find the first TitleBlock and return its body
 */
function getTitleFromBlocks(blocks: ContentBlock[] | undefined): string {
	const titleBlock = blocks?.find((b) => b.type === "title");
	return titleBlock?.body ?? "";
}

/**
 * Find the first TextBlock and return its body (used as description)
 */
function getDescriptionFromBlocks(blocks: ContentBlock[] | undefined): string {
	const textBlock = blocks?.find((b) => b.type === "text");
	return textBlock?.body ?? "";
}

/**
 * Find the first ActionsBlock with a url-type action and return its url and title
 */
function getUrlActionFromBlocks(
	blocks: ContentBlock[] | undefined,
): { href?: string; hrefTitle?: string } {
	const actionsBlock = blocks?.find((b) => b.type === "actions" && b.actions?.length);
	if (!actionsBlock?.actions) return {};

	const urlAction = actionsBlock.actions.find((a) => a.type === "url");
	if (!urlAction) return {};

	return {
		href: urlAction.body ?? undefined,
		hrefTitle: urlAction.title ?? undefined,
	};
}

/**
 * Validate and normalize a notification priority type
 */
function normalizeNotificationType(
	raw: string | undefined,
): INotification["type"] {
	if (
		raw &&
		VALID_NOTIFICATION_TYPES.includes(raw as (typeof VALID_NOTIFICATION_TYPES)[number])
	) {
		return raw as INotification["type"];
	}
	return "normal";
}

// ─── REST: ChannelMessage → INotification ────────────────────────────────────

/**
 * Shape of a ChannelMessage as returned by GET /channels/messages
 */
export interface ChannelMessageDto {
	id: string;
	type: string;
	direction?: string;
	status?: string;
	category?: string;
	priority?: string;
	level?: string;
	content?: MessageContent;
	metadata?: Record<string, unknown>;
	sentAt?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
}

/**
 * Map a ChannelMessage DTO from the REST API to INotification.
 *
 * - title    → first TitleBlock.body from content.blocks
 * - description → first TextBlock.body from content.blocks
 * - type     → message.priority (low | normal | high | urgent)
 * - href     → first ActionsBlock action with type="url", field url
 * - read     → derived from status: READ → true, otherwise false
 * - createdAt → sentAt or createdAt
 */
export function mapChannelMessageToNotification(
	msg: ChannelMessageDto,
): INotification {
	const blocks = msg.content?.blocks;
	const { href, hrefTitle } = getUrlActionFromBlocks(blocks);

	return {
		id: msg.id,
		title: getTitleFromBlocks(blocks) || "Nueva notificación",
		description: getDescriptionFromBlocks(blocks),
		type: normalizeNotificationType(msg.priority),
		read: msg.status === "READ",
		createdAt: new Date(msg.sentAt ?? msg.createdAt ?? new Date()),
		href,
		hrefTitle,
	};
}

// ─── WebSocket: webpush_message payload → INotification ──────────────────────

export interface WebpushNotificationPayload {
	channelMessageId?: string;
	userId?: string;
	timestamp?: string;
	message?: {
		content?: MessageContent | string;
		metadata?: {
			messageContent?: MessageContent;
			priority?: string;
			[key: string]: unknown;
		};
		priority?: string;
	};
	[key: string]: unknown;
}

/**
 * Map a WebSocket webpush_message payload to INotification.
 *
 * Uses the same block-based extraction as the REST mapper.
 */
export function mapWsPayloadToNotification(
	payload: WebpushNotificationPayload,
): INotification {
	const content =
		payload.message?.content && typeof payload.message.content === "object"
			? payload.message.content
			: payload.message?.metadata?.messageContent;
	const blocks = content?.blocks;

	const id =
		payload.channelMessageId ??
		(payload.message?.metadata?.id as string | undefined) ??
		crypto.randomUUID();

	const createdAt = payload.timestamp
		? new Date(payload.timestamp)
		: new Date();

	const { href, hrefTitle } = getUrlActionFromBlocks(blocks);

	return {
		id,
		title: getTitleFromBlocks(blocks) || "Nueva notificación",
		description: getDescriptionFromBlocks(blocks),
		type: normalizeNotificationType(payload.message?.priority),
		read: false,
		createdAt,
		href,
		hrefTitle,
	};
}
