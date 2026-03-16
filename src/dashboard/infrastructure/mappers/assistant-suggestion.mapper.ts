import type { IAssistantSuggestionAlert } from "../../domain/interfaces/dashboard.interface";
import type {
	ChannelMessageDto,
	ContentBlockDto,
} from "../dtos/channel-message.dto";

// ─── Helpers (misma lógica que notification.mapper) ─────────────────────────

function getTitleFromBlocks(blocks: ContentBlockDto[] | undefined): string {
	const titleBlock = blocks?.find((b) => b.type === "title");
	return titleBlock?.body ?? "";
}

function getDescriptionFromBlocks(blocks: ContentBlockDto[] | undefined): string {
	const textBlock = blocks?.find((b) => b.type === "text");
	return textBlock?.body ?? "";
}

function getUrlActionFromBlocks(
	blocks: ContentBlockDto[] | undefined,
): { href?: string; hrefTitle?: string } {
	const actionsBlock = blocks?.find(
		(b) => b.type === "actions" && b.actions?.length,
	);
	if (!actionsBlock?.actions) return {};

	const urlAction = actionsBlock.actions.find((a) => a.type === "url");
	if (!urlAction) return {};

	const href = urlAction.body ?? urlAction.url ?? undefined;
	return {
		href,
		hrefTitle: urlAction.title ?? undefined,
	};
}

/** Icono por defecto para sugerencias de Linda (assistant_suggestion) */
const DEFAULT_SUGGESTION_ICON = "solar:magic-stick-3-bold";

/**
 * Mapea un ChannelMessage DTO (GET /channels/messages?category=assistant_suggestion)
 * a IAssistantSuggestionAlert para las cards del dashboard.
 */
export function mapChannelMessageToAssistantSuggestion(
	msg: ChannelMessageDto,
): IAssistantSuggestionAlert {
	const blocks = msg.content?.blocks;
	const { href, hrefTitle } = getUrlActionFromBlocks(blocks);

	return {
		id: msg.id,
		icon: DEFAULT_SUGGESTION_ICON,
		title: getTitleFromBlocks(blocks) || "Sugerencia de Linda",
		description: getDescriptionFromBlocks(blocks),
		actionText: hrefTitle ?? "Ver más",
		redirectTo: href ?? "#",
	};
}