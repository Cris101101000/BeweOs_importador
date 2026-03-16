export interface EmbedScriptConfig {
	apiKey: string;
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	sdkUrl?: string;
}

export type ShareChannelType = "web" | "whatsapp" | "instagram";

export interface IShareLinkParams {
	channelType: ShareChannelType;
	businessId: string;
	phoneNumber?: string;
	instagramHandle?: string;
}
