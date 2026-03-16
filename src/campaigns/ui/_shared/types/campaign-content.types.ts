import type { Campaign, EnumCampaignContentType } from "@campaigns/domain";

/**
 * Tipos de UI para contenido de campañas
 * Usa tipos del dominio y añade propiedades específicas de UI
 */

/**
 * @deprecated Usar EnumCampaignContentType del dominio
 */
export type CampaignContentType = "whatsapp" | "email";

/**
 * Interface para preview de contenido de campaña en UI
 * Basada en la entidad Campaign del dominio
 */
export interface CampaignContent {
	id: string;
	imageUrl?: string;
	text: string;
	contentType: EnumCampaignContentType;
	targetAudienceCount?: number;
	audienceReason?: string;
	requiredTags?: string[];
}

/**
 * Props para el componente de preview de campaña
 */
export interface CampaignPreviewProps {
	isOpen: boolean;
	onClose: () => void;
	content: CampaignContent | null;
	onApprove?: () => void;
	onDiscard?: () => void;
}

/**
 * Helper para convertir Campaign del dominio a CampaignContent de UI
 */
export const toCampaignContent = (campaign: Campaign): CampaignContent => ({
	id: campaign.id,
	imageUrl: campaign.imageUrl,
	text: campaign.text,
	contentType: campaign.contentType,
	targetAudienceCount: campaign.targetAudienceCount,
	audienceReason: campaign.audienceReason,
	requiredTags: campaign.requiredTags,
});
