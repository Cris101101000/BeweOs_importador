import type {
	IScrapedUrl,
	IUrlGroup,
} from "../../domain/interfaces/urls";
import type { AssetDto } from "../dtos/assets-response.dto";

export class ScrapedUrlsMapper {
	static toDomain(dto: AssetDto): IScrapedUrl {
		return {
			id: dto.id,
			url: dto.storage.accessUrl,
			scrapedFrom: dto.metadata.scrapedFrom || "",
			scrapedDomain: dto.metadata.scrapedDomain || "",
			createdAt: new Date(dto.createdAt),
		};
	}

	static toDomainList(dtos: AssetDto[]): IScrapedUrl[] {
		return dtos.map((dto) => ScrapedUrlsMapper.toDomain(dto));
	}

	static toLoadedUrlList(scrapedUrls: IScrapedUrl[]): IUrlGroup[] {
		const groupedByDomain = new Map<string, IScrapedUrl[]>();

		for (const url of scrapedUrls) {
			const domain = url.scrapedDomain || "unknown";
			const existing = groupedByDomain.get(domain) || [];
			existing.push(url);
			groupedByDomain.set(domain, existing);
		}

		const loadedUrls: IUrlGroup[] = [];

		for (const [domain, urls] of groupedByDomain) {
			if (urls.length === 0) continue;

			const sortedUrls = urls.sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime()
			);

			const mainUrl = sortedUrls[0];
			const subUrls = sortedUrls.slice(1).map((u) => u.scrapedFrom);

			loadedUrls.push({
				id: `scraped-${domain}`,
				url: mainUrl.scrapedFrom || domain,
				subUrls,
				idScrapedUrls: urls.map((u) => u.id),
				loadedAt: mainUrl.createdAt,
				source: "database",
			});
		}

		return loadedUrls;
	}
}
