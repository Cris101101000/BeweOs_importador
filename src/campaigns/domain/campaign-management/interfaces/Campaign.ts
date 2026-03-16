import type { EnumCampaignContentType } from "../enums/EnumCampaignContentType";
import type { EnumCampaignStatus } from "../enums/EnumCampaignStatus";

/**
 * Interface principal para una campaña
 */
export interface ICampaign {
	id: string;
	name: string;
	contentType: EnumCampaignContentType;
	status: EnumCampaignStatus;
	imageUrl?: string;
	text: string;
	targetAudienceCount?: number;
	audienceReason?: string;
	requiredTags?: string[];
	scheduledAt?: Date;
	sentAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Interface para crear una campaña
 */
export interface ICreateCampaignInput {
	name: string;
	contentType: EnumCampaignContentType;
	imageUrl?: string;
	text: string;
	targetAudienceCount?: number;
	audienceReason?: string;
	requiredTags?: string[];
	scheduledAt?: Date;
}

/**
 * Interface para actualizar una campaña
 */
export interface IUpdateCampaignInput {
	id: string;
	name?: string;
	imageUrl?: string;
	text?: string;
	status?: EnumCampaignStatus;
	targetAudienceCount?: number;
	audienceReason?: string;
	requiredTags?: string[];
	scheduledAt?: Date;
}
