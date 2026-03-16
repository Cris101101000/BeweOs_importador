export class StartTrainingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "START_TRAINING_ERROR";
	}
}
