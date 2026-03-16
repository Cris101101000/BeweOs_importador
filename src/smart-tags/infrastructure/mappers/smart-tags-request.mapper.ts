import { ApplicableEntity } from "../../domain/enums/applicable-entity.enum.ts";
import { SmartTagStatus } from "../../domain/enums/smart-tag-status.enum.ts";
import type { SmartTagType } from "../../domain/enums/smart-tag-type.enum.ts";
import type { ISmartTag } from "../../domain/interfaces/smart-tags-interface.ts";
import type {
	CreateSmartTagRequestDto,
	UpdateSmartTagRequestDto,
} from "../dtos/get-smart-tags.dto.ts";
import { mapToApiFormat } from "../utils/applicable-entities-mapper.util.ts";

/**
 * Maps domain status (active, inactive, draft) to API status (ACTIVE, INACTIVE, DRAFT)
 */
const mapStatusToApi = (domainStatus: SmartTagStatus): string => {
	const statusMap: Record<SmartTagStatus, string> = {
		[SmartTagStatus.ACTIVE]: "ACTIVE",
		[SmartTagStatus.INACTIVE]: "INACTIVE",
		[SmartTagStatus.DRAFT]: "DRAFT",
	};

	return statusMap[domainStatus] || "INACTIVE";
};

/**
 * Maps domain SmartTagType to API type string
 * The enum values are already in the correct format for the API
 * API accepts: CUSTOMER_TYPE, BUYER_TYPE, FEELING, INTEREST, NEED, PROBLEM, SOLUTION, RESULT, ACTION, GOAL, OBJECTIVE
 */
const mapTypeToApi = (domainType: SmartTagType): string => {
	// The enum values match the API format directly
	return domainType;
};

/**
 * Converts an array of applicable entities (enum values or strings) to API format
 * Handles both ApplicableEntity enum values and string values from forms
 *
 * @param entities - Array of entities (can be ApplicableEntity or string)
 * @returns Array of uppercase API format strings
 */
const convertEntitiesToApiFormat = (
	entities: (ApplicableEntity | string)[]
): string[] => {
	return entities.map((entity) => {
		// If it's already uppercase (API format), return as-is
		if (entity === entity.toUpperCase() && entity.length > 0) {
			return entity;
		}

		// Find the key in the enum that has this value
		const enumKey = Object.keys(ApplicableEntity).find(
			(key) => ApplicableEntity[key as keyof typeof ApplicableEntity] === entity
		);

		return enumKey || entity.toUpperCase();
	});
};

/**
 * Maps domain ISmartTag to API CreateSmartTagRequestDto
 * @param tag - Domain tag object
 * @param applicableEntitiesOverride - Optional array of applicable entities to use directly (bypasses tag.applicableEntities)
 */
export function toCreateSmartTagRequest(
	tag: Omit<ISmartTag, "id" | "createdAt" | "updatedAt" | "usageCount">,
	applicableEntitiesOverride?: string[]
): CreateSmartTagRequestDto {
	// Determine applicable entities source
	const applicableEntities =
		applicableEntitiesOverride && applicableEntitiesOverride.length > 0
			? convertEntitiesToApiFormat(applicableEntitiesOverride)
			: mapToApiFormat(tag.applicableEntities);

	return {
		basicInfo: {
			title: tag.name,
			description: tag.description,
			color: tag.color,
		},
		keywords: tag.keywords,
		type: mapTypeToApi(tag.type),
		status: mapStatusToApi(tag.status),
		applicableEntities,
	};
}

/**
 * Maps domain ISmartTag to API UpdateSmartTagRequestDto
 * Only includes fields that were actually modified
 * @param tag - ISmartTag with all fields (merged from original + modified)
 * @param modifiedFields - Partial ISmartTag containing only the fields that changed
 * @param applicableEntitiesOverride - Optional array of applicable entities to use directly (bypasses tag.applicableEntities)
 */
export function toUpdateSmartTagRequest(
	tag: ISmartTag,
	modifiedFields: Partial<ISmartTag>,
	applicableEntitiesOverride?: string[]
): UpdateSmartTagRequestDto {
	const requestDto: Partial<UpdateSmartTagRequestDto> = {};

	// Check if any basicInfo fields were modified
	const hasBasicInfoChanges =
		"name" in modifiedFields ||
		"description" in modifiedFields ||
		"color" in modifiedFields;

	// Only include basicInfo if at least one of its fields was modified
	if (hasBasicInfoChanges) {
		requestDto.basicInfo = {
			title: tag.name,
			description: tag.description,
			color: tag.color,
		};
	}

	// Only include keywords if they were modified
	if ("keywords" in modifiedFields) {
		requestDto.keywords = tag.keywords;
	}

	// Only include type if it was modified
	if ("type" in modifiedFields) {
		requestDto.type = mapTypeToApi(tag.type);
	}

	// Only include status if it was modified
	if ("status" in modifiedFields) {
		requestDto.status = mapStatusToApi(tag.status);
	}

	// Include applicableEntities if:
	// 1. applicableEntitiesOverride is provided (from form data) - this takes priority
	// 2. OR if applicableEntities was modified
	if (applicableEntitiesOverride && applicableEntitiesOverride.length > 0) {
		requestDto.applicableEntities = convertEntitiesToApiFormat(
			applicableEntitiesOverride
		);
	} else if ("applicableEntities" in modifiedFields) {
		requestDto.applicableEntities = mapToApiFormat(tag.applicableEntities);
	}

	// Add temporality only if isTemporary or temporaryDuration were modified
	if (
		"isTemporary" in modifiedFields ||
		"temporaryDuration" in modifiedFields
	) {
		requestDto.temporality = {
			isTemporary: tag.isTemporary ?? false,
			defaultDuration: tag.temporaryDuration ?? null,
			allowCustomDuration: false, // Default value, can be adjusted if needed
			suggestedDurations: [], // Default empty array, can be adjusted if needed
			autoRemove: false, // Default value, can be adjusted if needed
		};
	}

	return requestDto as UpdateSmartTagRequestDto;
}
