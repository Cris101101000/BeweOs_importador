// Adapters
export { ContentGenerationAdapter } from "./adapters/content-generation.adapter";

// DTOs
export type {
	ContentGenerationDto,
	GetContentGenerationsResponseDto,
	CreateContentGenerationRequestDto,
	CreateContentGenerationResponseDto,
} from "./dtos/content-generation.dto";

export type {
	UpdateContentStatusRequestDto,
	UpdateContentStatusResponseDto,
} from "./dtos/update-content-status.dto";

// Mappers
export {
	toContentGenerationFromDto,
	toContentGenerationsFromDto,
	toContentGenerationResponseFromDto,
	toCarouselItemFromContentGeneration,
	toCarouselItemsFromContentGenerations,
	extractCaptionFromBlocks,
	extractImageFromBlocks,
} from "./mappers/content-generation.mapper";

// Utils
export {
	mapContentGenerationError,
	ContentGenerationError,
} from "./utils/content-generation-error.util";
