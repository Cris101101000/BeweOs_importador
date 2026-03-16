import type { IAiTag } from "../../domain/interfaces/ai-tag.interface";
import type {
	IAiTagFilterOptions,
	IAiTagPort,
} from "../../domain/ports/ai-tag.port";
import type { AiTagDto, GetAiTagsResponseDto } from "../dtos/ai-tag.dto";
import { toAiTagFromDto, toAiTagsFromDtos } from "../mappers/ai-tag.mapper";
import { httpService } from "@http";
import type { IHttpClient } from "@http";

/**
 * AI Tag Adapter
 *
 * Implementation of the AI Tag repository using the backend API.
 * Endpoint: GET /tags?applicableEntities=CLIENT&title=...
 */
export class AiTagAdapter implements IAiTagPort {
	private readonly httpClient: IHttpClient = httpService;

	/**
	 * Retrieves AI tags from the backend filtered by CLIENT entity
	 *
	 * @param options - Optional filter options (title for search)
	 * @returns Promise with array of AI tags
	 */
	async getAiTags(options?: IAiTagFilterOptions): Promise<IAiTag[]> {
		// Build query string
		const params = new URLSearchParams();
		params.append("applicableEntities", "CLIENT");

		// Add optional title filter if provided
		if (options?.title?.trim()) {
			params.append("title", options.title.trim());
		}

		const url = `/tags?${params.toString()}`;

		console.log("[AiTagAdapter] Fetching tags from:", url);

		const response = await this.httpClient.get<GetAiTagsResponseDto>(url);

		console.log("[AiTagAdapter] Raw response from backend:", response);

		if (response.success && response.data) {
			// Handle different response structures
			// Backend might return { items: [...] } or directly [...]
			const rawData = response.data as unknown;
			let tagsArray: AiTagDto[];

			if (Array.isArray(rawData)) {
				tagsArray = rawData;
			} else if (
				rawData &&
				typeof rawData === "object" &&
				"items" in rawData &&
				Array.isArray((rawData as { items: AiTagDto[] }).items)
			) {
				tagsArray = (rawData as { items: AiTagDto[] }).items;
			} else {
				console.warn("[AiTagAdapter] Unexpected response structure:", rawData);
				return [];
			}

			const tags = toAiTagsFromDtos(tagsArray);
			console.log("[AiTagAdapter] Tags received from backend:", tags);
			return tags;
		}

		if (!response.success) {
			throw new Error(response.error?.code || "failed_to_fetch_tags");
		}

		return [];
	}

	/**
	 * Creates a new AI tag for a client
	 *
	 * @param clientId - Client ID to associate the tag with
	 * @param tagData - Tag data to create
	 * @returns Promise with the created AI tag
	 */
	async createAiTag(
		clientId: string,
		tagData: Partial<IAiTag>
	): Promise<IAiTag> {
		const requestBody = {
			clientId,
			title: tagData.value || "",
			color: tagData.color,
		};

		const response = await this.httpClient.post<AiTagDto>(
			"/tags",
			requestBody
		);

		if (response.success && response.data) {
			return toAiTagFromDto(response.data);
		}

		if (!response.success) {
			throw new Error(response.error?.code || "failed_to_create_tag");
		}

		throw new Error("failed_to_create_tag");
	}

	/**
	 * Deletes an AI tag by ID
	 *
	 * @param id - Tag ID to delete
	 * @returns Promise with boolean indicating success
	 */
	async deleteAiTag(id: string): Promise<boolean> {
		const response = await this.httpClient.delete(`/tags/${id}`);

		if (response.success) {
			return true;
		}

		if (!response.success) {
			throw new Error(response.error?.code || "failed_to_delete_tag");
		}

		return false;
	}
}
