export type ChannelType = "web" | "instagram" | "whatsapp";

export interface ChannelCardProps {
	channelType: ChannelType;
	title: string;
	icon: string;
	iconBgColor: string;
	iconActiveColor: string;
	isIntegrated: boolean;
	isActive: boolean;
	accountInfo?: string;
	onShare: () => void;
	onIntegrate: () => void;
}
