import type { Result } from "@shared/domain/errors/Result";
import type { GetScrapedUrlsError } from "../errors/GetScrapedUrlsError";
import type { RetrieveUrlsError } from "../errors/RetrieveUrlsError";
import type { IScrapedUrl, ISubUrl } from "../interfaces/urls";

export interface IUrlsPort {
	retrieveUrls(url: string): Promise<Result<ISubUrl[], RetrieveUrlsError>>;
	getScrapedUrls(): Promise<Result<IScrapedUrl[], GetScrapedUrlsError>>;
}
