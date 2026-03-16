import type { Result } from "@shared/domain/errors/Result";
import type { GetScrapedUrlsError } from "../domain/errors/GetScrapedUrlsError";
import type { IScrapedUrl } from "../domain/interfaces/urls";
import type { IUrlsPort } from "../domain/ports/urls.port";

export class GetScrapedUrlsUseCase {
	constructor(private readonly urlsPort: IUrlsPort) {}

	async execute(): Promise<Result<IScrapedUrl[], GetScrapedUrlsError>> {
		return await this.urlsPort.getScrapedUrls();
	}
}
