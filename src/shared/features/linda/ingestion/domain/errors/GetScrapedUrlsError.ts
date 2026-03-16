export class GetScrapedUrlsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GET_SCRAPED_URLS_ERROR";
	}
}
