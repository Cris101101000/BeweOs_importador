import type { IAiTag } from "../../domain/interfaces/ai-tag.interface";
import type { AiTagDto } from "../dtos/ai-tag.dto";

/**
 * Maps AiTagDto to IAiTag domain object
 */
export const toAiTagFromDto = (dto: AiTagDto): IAiTag => ({
	id: dto.id,
	value: dto.title, // AiTagDto.title -> IAiTag.value
	color: dto.color,
	action: dto.action,
	createdAt: dto.createdAt
		? dto.createdAt instanceof Date
			? dto.createdAt.toISOString()
			: String(dto.createdAt)
		: undefined,
	updatedAt: dto.updatedAt
		? dto.updatedAt instanceof Date
			? dto.updatedAt.toISOString()
			: String(dto.updatedAt)
		: undefined,
	createdBy: dto.createdBy,
});

/**
 * Maps IAiTag domain object to AiTagDto
 */
export const toAiTagDto = (aiTag: IAiTag): AiTagDto => ({
	id: aiTag.id,
	title: aiTag.value, // IAiTag.value -> AiTagDto.title
	color: aiTag.color,
	action: aiTag.action,
	createdAt: aiTag.createdAt ? new Date(aiTag.createdAt) : undefined,
	updatedAt: aiTag.updatedAt ? new Date(aiTag.updatedAt) : undefined,
	createdBy: aiTag.createdBy || "", // Default empty string if not provided
});

/**
 * Maps array of AiTagDto to array of IAiTag
 */
export const toAiTagsFromDtos = (dtos: AiTagDto[]): IAiTag[] =>
	dtos.map(toAiTagFromDto);

/**
 * Maps array of IAiTag to array of AiTagDto
 */
export const toAiTagDtos = (aiTags: IAiTag[]): AiTagDto[] =>
	aiTags.map(toAiTagDto);
