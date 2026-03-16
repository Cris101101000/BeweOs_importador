import type { ApplicableEntity } from "../enums/applicable-entity.enum";
import type { SmartTagStatus } from "../enums/smart-tag-status.enum";
import type { SmartTagType } from "../enums/smart-tag-type.enum";

export interface ISmartTag {
	id: string;
	name: string;
	description: string;
	keywords: string[];
	color: string;
	type: SmartTagType;
	status: SmartTagStatus;
	/**
	 * Array of entities this tag can be applied to.
	 * This is scalable - simply add new values to ApplicableEntity enum
	 * to support new entity types without modifying this interface.
	 */
	applicableEntities: ApplicableEntity[];
	isCustom: boolean;
	isTemporary: boolean;
	temporaryDuration?: number; // Duration in days
	usageCount: number;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Helper type to check if a tag applies to a specific entity
 * Usage: tag.applicableEntities.includes(ApplicableEntity.CLIENT)
 */
export type ApplicableEntityCheck = (entity: ApplicableEntity) => boolean;

/**
 * Filter interface for smart tags table
 */
export interface SmartTagsTableFilters {
	search?: string;
	status?: {
		selectedStatuses: string[];
	};
	type?: {
		selectedTypes: string[];
	};
	origin?: {
		selectedOrigins: ("ai" | "manual")[];
	};
	usageRange?: {
		min?: number;
		max?: number;
	};
	dateRange?: {
		from?: Date;
		to?: Date;
	};
}

/**
 * Pagination info for smart tags
 */
export interface ISmartTagsPagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

/**
 * Paginated response for smart tags
 */
export interface ISmartTagsPaginatedResponse {
	items: ISmartTag[];
	pagination: ISmartTagsPagination;
}
