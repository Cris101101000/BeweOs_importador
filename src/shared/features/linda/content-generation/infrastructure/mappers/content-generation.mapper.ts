import type { CarouselItem } from "@social-networks/ui/proposed-content/components/content-carousel/content-carousel.types";
import { ContentCategory } from "../../domain/enums/content-category.enum";
import type { ContentGenerationStatus } from "../../domain/enums/content-generation-status.enum";
import type { ContentOrigin } from "../../domain/enums/content-origin.enum";
import type { ContentType } from "../../domain/enums/content-type.enum";
import type {
	IContentGeneration,
	IContentGenerationResponse,
	IGeneratedAsset,
} from "../../domain/interfaces/content-generation.interface";
import type {
	ContentGenerationDto,
	GetContentGenerationsResponseDto,
} from "../dtos/content-generation.dto";

/**
 * Parse JSON string safely, return default value if parsing fails
 */
function safeJsonParse<T>(jsonString: string | undefined, defaultValue: T): T {
	if (!jsonString) return defaultValue;
	try {
		return JSON.parse(jsonString);
	} catch {
		return defaultValue;
	}
}

/**
 * Map ContentGenerationDto to IContentGeneration (DTO → Domain)
 */
export function toContentGenerationFromDto(
	dto: ContentGenerationDto
): IContentGeneration {
	return {
		id: dto.id,
		name: dto.name,
		type: dto.type as ContentType,
		category: dto.category as ContentCategory,
		language: dto.language,
		contentType: dto.content_type,
		variables: safeJsonParse(dto.variables, {}),
		blocks: safeJsonParse(dto.blocks, []),
		agencyId: dto.agency_id,
		agencyName: dto.agency_name,
		companyId: dto.company_id,
		companyName: dto.company_name,
		generatedAssets: safeJsonParse<IGeneratedAsset[]>(dto.generated_assets, []),
		status: dto.status as ContentGenerationStatus,
		origin: dto.origin as ContentOrigin | undefined,
		errorDetails: dto.error_details
			? safeJsonParse(dto.error_details, {})
			: undefined,
		createdAt: new Date(dto.created_at),
		updatedAt: new Date(dto.updated_at),
		publishedAt: dto.published_at ? new Date(dto.published_at) : undefined,
	};
}

/**
 * Map array of ContentGenerationDto to array of IContentGeneration
 */
export function toContentGenerationsFromDto(
	dtos: ContentGenerationDto[]
): IContentGeneration[] {
	return dtos.map(toContentGenerationFromDto);
}

/**
 * Map GetContentGenerationsResponseDto to IContentGenerationResponse
 */
export function toContentGenerationResponseFromDto(
	dto: GetContentGenerationsResponseDto
): IContentGenerationResponse {
	return {
		total: dto.total,
		page: dto.page,
		limit: dto.limit,
		totalPages: dto.total_pages,
		data: toContentGenerationsFromDto(dto.data),
	};
}

/**
 * Extract caption text from blocks array and replace variables with values from variables object
 * Blocks structure: [{ type: "text", body: "..." }, { type: "image", url: "...", alt: "..." }]
 * 
 * @param blocks - Array of blocks from content generation
 * @param variables - Variables object from response.variables to replace {{variable}} placeholders
 * @returns Caption text with variables replaced by their values
 */
export function extractCaptionFromBlocks(
	blocks: any[],
	variables?: Record<string, unknown>
): string {
	if (!Array.isArray(blocks) || blocks.length === 0) return "";

	let captionText = blocks
		.filter(
			(block) =>
				typeof block === "object" && block.type === "text" && block.body
		)
		.map((block) => block.body)
		.join("\n\n");

	// Reemplazar variables {{variable}} con valores de variables (response.variables)
	if (variables && typeof variables === "object" && !Array.isArray(variables)) {
		captionText = captionText.replace(
			/\{\{(\w+)\}\}/g,
			(match, variableName: string) => {
				const normalizedKey = variableName.toLowerCase();
				let variableValue = variables[variableName];

				if (variableValue === undefined) {
					const foundKey = Object.keys(variables).find(
						(key) => key.toLowerCase() === normalizedKey
					);
					if (foundKey) {
						variableValue = variables[foundKey];
					}
				}

				if (variableValue !== null && variableValue !== undefined) {
					return String(variableValue);
				}

				return match;
			}
		);
	}

	return captionText;
}

/**
 * Extract image URL from blocks array
 * Looks for blocks with type "image" and extracts the URL
 */
export function extractImageFromBlocks(blocks: any[]): string | undefined {
	if (!Array.isArray(blocks) || blocks.length === 0) return undefined;

	const imageBlock = blocks.find(
		(block) => typeof block === "object" && block.type === "image" && block.url
	);

	return imageBlock?.url;
}

/**
 * Map content type to carousel type
 */
function mapContentTypeToCarouselType(
	contentType: string
): CarouselItem["type"] {
	const lowerType = contentType.toLowerCase();
	
	if (lowerType.includes("story")) return "instagram-story";
	if (lowerType.includes("post") || lowerType.includes("image"))
		return "instagram-post";
	if (lowerType.includes("tiktok") || lowerType.includes("video"))
		return "tiktok-video";
	if (['whatsapp', 'message'].includes(lowerType)) return "whatsapp-message";

	return "instagram-post"; // default
}

/**
 * Generate gradient based on category
 */
function getGradientForCategory(category: ContentCategory): string {
	const gradients = {
		[ContentCategory.PROMOTIONAL]:
			"linear-gradient(180deg, #fda4af 0%, #fb7185 100%)",
		[ContentCategory.INFORMATIONAL]:
			"linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)",
		[ContentCategory.EDUCATIONAL]:
			"linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)",
		[ContentCategory.ENTERTAINMENT]:
			"linear-gradient(180deg, #f0abfc 0%, #e879f9 100%)",
	};

	return gradients[category] || gradients[ContentCategory.PROMOTIONAL];
}

/**
 * Map IContentGeneration to CarouselItem (Domain → UI)
 */
export function toCarouselItemFromContentGeneration(
	content: IContentGeneration
): CarouselItem {
	// Extract image URL from blocks first, fallback to generatedAssets
	const imageFromBlocks = extractImageFromBlocks(content.blocks);
	const firstAsset =
		content.generatedAssets && content.generatedAssets.length > 0
			? content.generatedAssets[0]
			: null;

	return {
		id: content.id,
		title: content.name,
		caption: extractCaptionFromBlocks(content.blocks, content.variables),
		imageUrl: firstAsset?.url, //imageFromBlocks ||  TODo: fix when back updateurl blocks
		gradient: getGradientForCategory(content.category),
		type: mapContentTypeToCarouselType(content.contentType),
		// Extended fields from API
		name: content.name,
		category: content.category,
		language: content.language,
		variables: content.variables,
		blocks: content.blocks,
		generatedAssets: content.generatedAssets,
		status: content.status,
		origin: content.origin,
		createdAt: content.createdAt,
		updatedAt: content.updatedAt,
		publishedAt: content.publishedAt,
	};
}

/**
 * Map array of IContentGeneration to array of CarouselItem
 */
export function toCarouselItemsFromContentGenerations(
	contents: IContentGeneration[]
): CarouselItem[] {
	return contents.map(toCarouselItemFromContentGeneration);
}
