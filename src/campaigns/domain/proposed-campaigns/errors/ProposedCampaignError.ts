export class ProposedCampaignError extends Error {
	constructor(message: string, public readonly code?: string) {
		super(message);
		this.name = "ProposedCampaignError";
	}
}

export class GetProposedCampaignError extends ProposedCampaignError {
	constructor(message = "Error getting proposed campaigns") {
		super(message, "GET_PROPOSED_CAMPAIGN_ERROR");
	}
}

export class DeleteProposedCampaignError extends ProposedCampaignError {
	constructor(message = "Error deleting proposed campaign") {
		super(message, "DELETE_PROPOSED_CAMPAIGN_ERROR");
	}
}
