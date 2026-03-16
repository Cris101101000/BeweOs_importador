import { INGESTION_CONSTANTS } from "../../domain/constants/ingestion.constants";
import type { ISubUrl } from "../../domain/interfaces/urls";
import type { UrlResponseDto } from "../dtos/urls-response.dto";

export class UrlsMapper {
	static toDomain(
		dto: UrlResponseDto,
		index: number,
		maxSelected: number
	): ISubUrl {
		const urlString = typeof dto === "string" ? dto : dto?.url || "";
		const title = typeof dto === "string" ? "" : dto?.title;
		const description = typeof dto === "string" ? undefined : dto?.description;
		const depth = typeof dto === "string" ? 0 : (dto?.depth ?? 0);
		const size = typeof dto === "string" ? 0 : (dto?.size ?? 0);

		return {
			id: `url-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
			url: urlString,
			title: title || UrlsMapper.extractTitleFromUrl(urlString),
			description,
			depth,
			size,
			selected: index < maxSelected,
			recommended: index < 5,
		};
	}

	static toDomainList(dtos: UrlResponseDto[] | unknown[]): ISubUrl[] {
		if (!Array.isArray(dtos)) {
			console.warn("UrlsMapper.toDomainList received non-array:", dtos);
			return [];
		}
		const maxSelected = INGESTION_CONSTANTS.MAX_SELECTED_URLS;
		return dtos
			.filter((dto) => dto != null)
			.map((dto, index) =>
				UrlsMapper.toDomain(dto as UrlResponseDto, index, maxSelected)
			);
	}

	private static extractTitleFromUrl(url: string): string {
		try {
			const urlObj = new URL(url);
			const path = urlObj.pathname;

			if (path === "/" || path === "") {
				return "Página Principal";
			}

			const segments = path.split("/").filter(Boolean);
			const lastSegment = segments[segments.length - 1] || "Página";

			return lastSegment
				.replace(/[-_]/g, " ")
				.replace(/\b\w/g, (char) => char.toUpperCase());
		} catch {
			return "Página";
		}
	}
}
