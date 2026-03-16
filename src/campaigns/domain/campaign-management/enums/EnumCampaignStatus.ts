/**
 * Estados de una campaña
 */
export enum EnumCampaignStatus {
	DRAFT = "draft",
	SCHEDULED = "scheduled",
	SENDING = "sending",
	SENT = "sent",
	PAUSED = "paused",
	CANCELLED = "cancelled",
	FAILED = "failed",
}
