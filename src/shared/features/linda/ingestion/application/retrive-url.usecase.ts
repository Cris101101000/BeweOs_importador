import type { Result } from "@shared/domain/errors/Result";
import type { RetrieveUrlsError } from "../domain/errors/RetrieveUrlsError";
import type { ISubUrl } from "../domain/interfaces/urls";
import type { IUrlsPort } from "../domain/ports/urls.port";

export class RetriveUrlUseCase {
	constructor(private readonly urlsPort: IUrlsPort) {}

	async execute(url: string): Promise<Result<ISubUrl[], RetrieveUrlsError>> {
		return await this.urlsPort.retrieveUrls(url);
	}
}
