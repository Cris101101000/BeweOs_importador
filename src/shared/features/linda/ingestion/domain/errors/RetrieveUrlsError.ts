export class RetrieveUrlsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RETRIEVE_URLS_ERROR";
	}
}
