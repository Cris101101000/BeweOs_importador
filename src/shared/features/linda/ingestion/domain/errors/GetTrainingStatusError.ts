export class GetTrainingStatusError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GET_TRAINING_STATUS_ERROR";
	}
}
