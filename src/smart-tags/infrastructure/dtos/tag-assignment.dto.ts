/**
 * Request DTO for creating a tag assignment
 */
export interface CreateTagAssignmentRequestDto {
	assignment: {
		tagId: string;
		entityType: string;
		entityId: string;
	};
	status: string;
}

import type { ApplicableEntityApiType } from "../../domain/enums/applicable-entity.enum";
import type { TagAssignmentStatusApi } from "../../domain/enums/smart-tag-status.enum";
import type { TagAssignmentSourceType } from "../../domain/interfaces/tag-assignment.interface";

/**
 * DTO for the assignment details within a tag assignment response
 */
export interface TagAssignmentDetailDto {
	tagId: string;
	entityType: ApplicableEntityApiType;
	entityId: string;
}

/**
 * DTO for the source information of a tag assignment
 */
export interface TagAssignmentSourceDto {
	type: TagAssignmentSourceType;
	aiModel: string | null;
	suggestedAt: string | null;
	approvedAt: string | null;
	context: string | null;
}

/**
 * DTO for a single tag assignment record from the API
 */
export interface TagAssignmentDto {
	id: string;
	agencyId: string;
	companyId: string;
	createdBy: string;
	assignment: TagAssignmentDetailDto;
	source: TagAssignmentSourceDto;
	status: TagAssignmentStatusApi;
	removedAt: string | null;
	removedBy: string | null;
	removalReason: string | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * DTO for the tag basic info in the assignments response
 */
export interface TagAssignmentTagInfoDto {
	id: string;
	basicInfo: {
		title: string;
		description: string;
		color: string;
	};
}

/**
 * DTO for the response data when getting tag assignments
 */
export interface GetTagAssignmentsDataDto {
	tag?: TagAssignmentTagInfoDto;
	tagAssignments?: TagAssignmentDto[];
}

/**
 * DTO for tag info when querying assignments by entity
 */
export interface EntityAssignmentTagDto {
	id: string;
	title: string;
	description: string;
	color: string;
}

/**
 * DTO for a single assignment item when querying by entity
 */
export interface EntityAssignmentItemDto {
	id: string;
	tag: EntityAssignmentTagDto;
	status: TagAssignmentStatusApi;
	source: TagAssignmentSourceDto;
	createdAt: string;
	updatedAt: string;
}

/**
 * DTO for the response data when getting assignments by entity (entityType + entityId)
 */
export interface GetAssignmentsByEntityDataDto {
	items: EntityAssignmentItemDto[];
}

/**
 * DTO for a single item in the entity assignments API response
 * API returns: [{ tag: {...}, tagAssignments: [{...}] }, ...]
 * Note: tagAssignments is an ARRAY
 */
export interface EntityAssignmentResponseItemDto {
	tag: {
		id: string;
		basicInfo: {
			title: string;
			description: string;
			color: string;
		};
	};
	tagAssignments: Array<{
		id: string;
		status?: string;
		source?: {
			type?: string;
		};
		createdAt?: string;
		updatedAt?: string;
	}>;
}
