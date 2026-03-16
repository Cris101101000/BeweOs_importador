/**
 * Exportaciones públicas del dominio de Campaigns organizada por features
 */

// Campaign Management
export * from "./campaign-management/enums/EnumCampaignStatus";
export * from "./campaign-management/enums/EnumCampaignContentType";
export * from "./campaign-management/interfaces/Campaign";
export * from "./campaign-management/ports/CampaignPort";
export * from "./campaign-management/errors/CampaignError";

// Proposed Campaigns
export * from "./proposed-campaigns/interfaces/ProposedCampaign";
export * from "./proposed-campaigns/ports/ProposedCampaignPort";
export * from "./proposed-campaigns/errors/ProposedCampaignError";

// Templates
export * from "./templates/interfaces/Template";
export * from "./templates/ports/TemplatePort";
export * from "./templates/errors/TemplateError";

// Audience
export * from "./audience/interfaces/Audience";
export * from "./audience/ports/AudiencePort";
export * from "./audience/errors/AudienceError";
