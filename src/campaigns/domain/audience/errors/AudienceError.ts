export class AudienceError extends Error {
	constructor(message: string, public readonly code?: string) {
		super(message);
		this.name = "AudienceError";
	}
}

export class GetAudienceDataError extends AudienceError {
	constructor(message = "Error getting audience data") {
		super(message, "GET_AUDIENCE_DATA_ERROR");
	}
}

export class CalculateAudienceError extends AudienceError {
	constructor(message = "Error calculating audience size") {
		super(message, "CALCULATE_AUDIENCE_ERROR");
	}
}
