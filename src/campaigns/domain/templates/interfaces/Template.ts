import type { EnumCampaignContentType } from "@campaigns/domain/campaign-management/enums/EnumCampaignContentType";

/**
 * Interface para plantillas de campañas
 */
export interface ITemplate {
	id: string;
	name: string;
	description?: string;
	contentType: EnumCampaignContentType;
	thumbnailUrl?: string;
	content: string;
	tags?: string[];
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Interface para crear una plantilla
 */
export interface ICreateTemplateInput {
	name: string;
	description?: string;
	contentType: EnumCampaignContentType;
	thumbnailUrl?: string;
	content: string;
	tags?: string[];
}
