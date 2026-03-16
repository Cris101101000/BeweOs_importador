import { SmartTagStatus } from "../../domain/enums/smart-tag-status.enum.ts";
import { SmartTagType } from "../../domain/enums/smart-tag-type.enum.ts";
import type { ISmartTag } from "../../domain/interfaces/smart-tags-interface.ts";
import type { SmartTagResponseDto } from "../dtos/get-smart-tags.dto.ts";
import { mapToApplicableEntities } from "../utils/applicable-entities-mapper.util.ts";

/**
 * Maps API status (ACTIVE, INACTIVE, DRAFT) to domain status (active, inactive, draft)
 */
const mapStatusFromApi = (apiStatus: string): SmartTagStatus => {
	const statusMap: Record<string, SmartTagStatus> = {
		ACTIVE: SmartTagStatus.ACTIVE,
		INACTIVE: SmartTagStatus.INACTIVE,
		DRAFT: SmartTagStatus.DRAFT,
	};

	return statusMap[apiStatus] || SmartTagStatus.DRAFT;
};

/**
 * Maps API type to domain SmartTagType
 * API values: CUSTOMER_TYPE, BUYER_TYPE, FEELING, INTEREST, NEED, PROBLEM, SOLUTION, RESULT, ACTION, GOAL, OBJECTIVE
 * The enum values match the API format directly
 */
const mapTypeFromApi = (apiType: string): SmartTagType => {
	// The enum values match the API format directly, so we can use the value as-is
	// If the value is not in the enum, default to ACTION
	if (Object.values(SmartTagType).includes(apiType as SmartTagType)) {
		return apiType as SmartTagType;
	}
	return SmartTagType.ACTION;
};

/**
 * Maps sourceType to isCustom boolean
 * AI_AUTO and AI_MANUAL are not custom (AI generated)
 * MANUAL is custom (user created)
 */
const mapIsCustomFromSourceType = (sourceType: string): boolean => {
	return sourceType === "MANUAL";
};

/**
 * Maps API response DTO to domain ISmartTag
 */
export function toSmartTagFromResponse(tag: SmartTagResponseDto): ISmartTag {
	// Convert defaultDuration from days to number (if available)
	// If defaultDuration is null, use undefined for temporaryDuration
	const temporaryDuration = tag.temporality.defaultDuration
		? tag.temporality.defaultDuration
		: undefined;

	return {
		id: tag.id,
		name: tag.basicInfo.title,
		description: tag.basicInfo.description,
		keywords: tag.keywords,
		color: tag.basicInfo.color,
		type: mapTypeFromApi(tag.type),
		status: mapStatusFromApi(tag.status),
		applicableEntities: mapToApplicableEntities(tag.applicableEntities),
		isCustom: mapIsCustomFromSourceType(tag.sourceType),
		isTemporary: tag.temporality.isTemporary,
		temporaryDuration,
		usageCount: tag.usageCount,
		createdAt: new Date(tag.createdAt),
		updatedAt: new Date(tag.updatedAt),
	};
}

/**
 * Maps array of API response DTOs to array of domain ISmartTags
 */
export function toSmartTagsFromResponse(
	tags: SmartTagResponseDto[]
): ISmartTag[] {
	return tags.map((tag) => toSmartTagFromResponse(tag));
}
