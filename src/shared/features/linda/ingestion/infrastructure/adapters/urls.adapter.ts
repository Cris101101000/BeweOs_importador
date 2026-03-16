import { Result } from "@shared/domain/errors/Result";
import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import { GetScrapedUrlsError } from "../../domain/errors/GetScrapedUrlsError";
import { RetrieveUrlsError } from "../../domain/errors/RetrieveUrlsError";
import type {
	IScrapedUrl,
	ISubUrl,
} from "../../domain/interfaces/urls";
import type { IUrlsPort } from "../../domain/ports/urls.port";
import type { AssetsResponseDto } from "../dtos/assets-response.dto";
import type { UrlResponseDto } from "../dtos/urls-response.dto";
import { ScrapedUrlsMapper } from "../mappers/scraped-urls.mapper";
import { UrlsMapper } from "../mappers/urls.mapper";

interface RetrieveUrlsResponse {
	urls?: UrlResponseDto[];
	data?: UrlResponseDto[];
}

export class UrlsAdapter implements IUrlsPort {
	private readonly httpClient: IHttpClient = httpService;

	async retrieveUrls(
		url: string
	): Promise<Result<ISubUrl[], RetrieveUrlsError>> {
		const response = await this.httpClient.post<
			RetrieveUrlsResponse | UrlResponseDto[]
		>("linda/training/retrieve-urls", {
			baseUrl: url,
			depth: 1,
			enableBrandExtraction: false,
		});

		if (!response.success) {
			return Result.Err(
				new RetrieveUrlsError(
					response.error?.message || "Failed to retrieve URLs"
				)
			);
		}

		console.log("API Response:", response.data);

		let urlsData: UrlResponseDto[];

		if (Array.isArray(response.data)) {
			urlsData = response.data;
		} else if (response.data?.urls) {
			urlsData = response.data.urls;
		} else if (response.data?.data) {
			urlsData = response.data.data;
		} else {
			console.error("Unexpected API response structure:", response.data);
			urlsData = [];
		}

		return Result.Ok(UrlsMapper.toDomainList(urlsData));
	}

	async getScrapedUrls(): Promise<Result<IScrapedUrl[], GetScrapedUrlsError>> {
		const response = await this.httpClient.get<AssetsResponseDto>(
			"assets?contexts=scraped"
		);
		if (response.success && response.data) {
			return Result.Ok(ScrapedUrlsMapper.toDomainList(response.data.assets));
		}
		return Result.Err(
			new GetScrapedUrlsError(
				response.error?.message || "Failed to get scraped urls"
			)
		);
	}
}
