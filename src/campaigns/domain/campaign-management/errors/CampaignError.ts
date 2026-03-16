export class CampaignError extends Error {
	constructor(message: string, public readonly code?: string) {
		super(message);
		this.name = "CampaignError";
	}
}

export class CreateCampaignError extends CampaignError {
	constructor(message = "Error creating campaign") {
		super(message, "CREATE_CAMPAIGN_ERROR");
	}
}

export class UpdateCampaignError extends CampaignError {
	constructor(message = "Error updating campaign") {
		super(message, "UPDATE_CAMPAIGN_ERROR");
	}
}

export class GetCampaignError extends CampaignError {
	constructor(message = "Error getting campaign(s)") {
		super(message, "GET_CAMPAIGN_ERROR");
	}
}

export class DeleteCampaignError extends CampaignError {
	constructor(message = "Error deleting campaign") {
		super(message, "DELETE_CAMPAIGN_ERROR");
	}
}

export class SendCampaignError extends CampaignError {
	constructor(message = "Error sending campaign") {
		super(message, "SEND_CAMPAIGN_ERROR");
	}
}
