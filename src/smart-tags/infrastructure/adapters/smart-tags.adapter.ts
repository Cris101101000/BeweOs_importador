import { httpService } from "@http";
import type { IHttpClient } from "@http";
import type {
	ISmartTag,
	ISmartTagsPaginatedResponse,
} from "../../domain/interfaces/smart-tags-interface.ts";
import type { ISmartTagPort } from "../../domain/ports/smart-tags.port.ts";
import type {
	CreateSmartTagApiResponse,
	GetSmartTagsApiResponse,
	UpdateSmartTagApiResponse,
} from "../dtos/get-smart-tags.dto.ts";
import {
	toCreateSmartTagRequest,
	toUpdateSmartTagRequest,
} from "../mappers/smart-tags-request.mapper.ts";
import {
	toSmartTagFromResponse,
	toSmartTagsFromResponse,
} from "../mappers/smart-tags-response.mapper.ts";
import {
	getModifiedFields,
	hasModifiedFields,
} from "../utils/field-comparison.util.ts";

export interface SmartTagsFilters {
	title?: string;
	status?: string | string[]; // Can be single status or array for multiselect
	types?: string[];
	applicableEntities?: string[];
	sourceType?: string;
	usageCountMin?: number;
	usageCountMax?: number;
	limit?: number;
	offset?: number;
}

export class SmartTagAdapter implements ISmartTagPort {
	private readonly httpClient: IHttpClient = httpService;

	/**
	 * Get smart tags with pagination info
	 * Returns both the items and pagination metadata from the API
	 *
	 * Note: If you only need the items without pagination, use:
	 * const { items } = await getSmartTags(filters);
	 */
	async getSmartTags(
		filters?: SmartTagsFilters
	): Promise<ISmartTagsPaginatedResponse> {
		const queryParams = new URLSearchParams();

		// Set default limit if not provided
		const limit = filters?.limit || 10;
		const offset = filters?.offset ?? 0;

		if (filters) {
			if (filters.title) {
				queryParams.append("title", filters.title);
			}
			if (filters.status) {
				if (Array.isArray(filters.status)) {
					for (const status of filters.status) {
						queryParams.append("status", status);
					}
				} else {
					queryParams.append("status", filters.status);
				}
			}
			if (
				filters.types &&
				Array.isArray(filters.types) &&
				filters.types.length > 0
			) {
				for (const type of filters.types) {
					queryParams.append("types", type);
				}
			}
			if (
				filters.applicableEntities &&
				Array.isArray(filters.applicableEntities) &&
				filters.applicableEntities.length > 0
			) {
				for (const entity of filters.applicableEntities) {
					queryParams.append("applicableEntities", entity);
				}
			}
			if (filters.sourceType) {
				queryParams.append("sourceType", filters.sourceType);
			}
			if (filters.usageCountMin !== undefined) {
				queryParams.append("usageCountMin", String(filters.usageCountMin));
			}
			if (filters.usageCountMax !== undefined) {
				queryParams.append("usageCountMax", String(filters.usageCountMax));
			}
		}

		// Always append limit and offset
		queryParams.append("limit", String(limit));
		queryParams.append("offset", String(offset));

		const queryString = queryParams.toString();
		const url = `/tags${queryString ? `?${queryString}` : ""}`;
		const response = await this.httpClient.get<GetSmartTagsApiResponse>(url);

		if (response.success && response.data) {
			const tags = toSmartTagsFromResponse(response.data.items);
			const total = response.data.total ?? 0;
			const currentPage = Math.floor(offset / limit) + 1;
			const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

			return {
				items: tags,
				pagination: {
					page: currentPage,
					limit,
					total,
					totalPages,
				},
			};
		}

		throw new Error(response.error?.code || "API call failed");
	}

	async getSmartTagById(id: string): Promise<ISmartTag | null> {
		if (!id) {
			throw new Error("Tag ID is required");
		}

		const response = await this.httpClient.get<UpdateSmartTagApiResponse>(
			`/tags/${id}`
		);

		if (response.success && response.data) {
			const tag = toSmartTagFromResponse(response.data);
			return tag;
		}

		const errorMessage =
			response.error?.message ||
			response.error?.code ||
			"Failed to fetch smart tag";
		throw new Error(errorMessage);
	}

	async createSmartTag(
		tag: Omit<ISmartTag, "id" | "createdAt" | "updatedAt">
	): Promise<ISmartTag> {
		// Extract applicableEntitiesOverride from tag if present (temporary property from form)
		const tagWithOverride = tag as Omit<
			ISmartTag,
			"id" | "createdAt" | "updatedAt"
		> & { _applicableEntitiesOverride?: string[] };
		const applicableEntitiesOverride =
			tagWithOverride._applicableEntitiesOverride;

		// Remove temporary property before mapping
		const { _applicableEntitiesOverride, ...cleanTag } = tagWithOverride;

		// Convert domain tag to API request format
		const requestPayload = toCreateSmartTagRequest(
			cleanTag,
			applicableEntitiesOverride
		);

		// Make the API call
		const response = await this.httpClient.post<CreateSmartTagApiResponse>(
			"/tags",
			requestPayload
		);

		if (response.success && response.data) {
			const createdTag = toSmartTagFromResponse(response.data);
			return createdTag;
		}

		throw new Error(response.error?.code || "Failed to create smart tag");
	}

	async updateSmartTag(
		id: string,
		updates: Partial<ISmartTag>
	): Promise<ISmartTag> {
		const existingTag = await this.getSmartTagById(id);
		if (!existingTag) {
			throw new Error("Smart tag not found");
		}

		const updatesWithOverride = updates as Partial<ISmartTag> & {
			_applicableEntitiesOverride?: string[];
		};
		const applicableEntitiesOverride =
			updatesWithOverride._applicableEntitiesOverride;
		const { _applicableEntitiesOverride, ...cleanUpdates } =
			updatesWithOverride;

		const modifiedFields = getModifiedFields(existingTag, cleanUpdates);

		if (!hasModifiedFields(modifiedFields)) {
			return existingTag;
		}

		// Merge existing tag with only modified fields
		const mergedTag: ISmartTag = {
			...existingTag,
			...modifiedFields,
		};

		const requestPayload = toUpdateSmartTagRequest(
			mergedTag,
			modifiedFields,
			applicableEntitiesOverride
		);
		const response = await this.httpClient.put<UpdateSmartTagApiResponse>(
			`/tags/${id}`,
			requestPayload
		);

		if (response.success && response.data) {
			const updatedTag = toSmartTagFromResponse(response.data);
			return updatedTag;
		}

		// Use message from backend if available, otherwise fallback to code
		const errorMessage =
			response.error?.message ||
			response.error?.code ||
			"Failed to update smart tag";
		throw new Error(errorMessage);
	}

	async deleteSmartTag(id: string): Promise<void> {
		// Use query parameter format: /tags?ids=id
		const url = `/tags?ids=${encodeURIComponent(id)}`;
		const response = await this.httpClient.delete(url);

		if (response.success) {
			return;
		}

		// Use message from backend if available, otherwise fallback to code
		const errorMessage =
			response.error?.message ||
			response.error?.code ||
			"Failed to delete smart tag";
		throw new Error(errorMessage);
	}

	async deleteSmartTags(ids: string[]): Promise<void> {
		if (!ids || ids.length === 0) {
			throw new Error("At least one tag ID is required");
		}

		const queryParams = new URLSearchParams();
		ids.forEach((id) => {
			queryParams.append("ids", id);
		});
		const url = `/tags?${queryParams.toString()}`;
		const response = await this.httpClient.delete(url);

		if (response.success) {
			return;
		}

		// Use message from backend if available, otherwise fallback to code
		const errorMessage =
			response.error?.message ||
			response.error?.code ||
			"Failed to delete smart tags";
		throw new Error(errorMessage);
	}
}
