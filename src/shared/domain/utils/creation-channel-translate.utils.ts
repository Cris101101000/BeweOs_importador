import { EnumCreationChannel } from "../enums/enum-creation-channel.enum";

/**
 * Get the translation key for a creation channel value
 * @param channel - The creation channel enum value to get translation key for
 * @returns The translation key string for the channel
 */
export const getCreationChannelTranslationKey = (
	channel: EnumCreationChannel
): string => {
	switch (channel) {
		case EnumCreationChannel.Web:
			return "channel_web";
		case EnumCreationChannel.Widget:
			return "channel_widget";
		case EnumCreationChannel.Api:
			return "channel_api";
		case EnumCreationChannel.LindaChat:
			return "channel_linda_chat";
		default:
			return "channel_web"; // Default fallback
	}
};

/**
 * Get the translated creation channel text
 * @param channel - The creation channel enum value to translate
 * @param t - Translation function from useTranslate hook
 * @returns The translated creation channel string
 */
export const getCreationChannelTranslate = (
	channel: EnumCreationChannel,
	t: (key: string, fallback?: string) => string
): string => {
	switch (channel) {
		case EnumCreationChannel.Web:
			return t("channel_web", "Web");
		case EnumCreationChannel.Widget:
			return t("channel_widget", "Widget");
		case EnumCreationChannel.Api:
			return t("channel_api", "API");
		case EnumCreationChannel.LindaChat:
			return t("channel_linda_chat", "Linda Chat");
		default:
			return t("channel_web", "Web"); // Default fallback
	}
};

/**
 * Get all creation channel translation keys
 * @returns Array of all creation channel translation keys
 */
export const getAllCreationChannelKeys = (): string[] => {
	return ["channel_web", "channel_widget", "channel_api", "channel_linda_chat"];
};

/**
 * Map creation channel string value to enum
 * @param channelValue - String value from API response
 * @returns EnumCreationChannel enum value
 */
export const mapCreationChannel = (
	channelValue?: string
): EnumCreationChannel => {
	if (!channelValue) return EnumCreationChannel.Web;

	const normalizedChannel = channelValue.toLowerCase();

	switch (normalizedChannel) {
		case "web":
			return EnumCreationChannel.Web;
		case "widget":
			return EnumCreationChannel.Widget;
		case "api":
			return EnumCreationChannel.Api;
		case "linda_chat":
		case "linda chat":
		case "lindachat":
			return EnumCreationChannel.LindaChat;
		default:
			return EnumCreationChannel.Web; // Default fallback
	}
};
