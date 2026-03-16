import type { ApplicableEntityApiType } from "../enums/applicable-entity.enum";
import type { TagAssignmentStatusApi } from "../enums/smart-tag-status.enum";

// Re-export for convenience
export type { ApplicableEntityApiType, TagAssignmentStatusApi };

/**
 * Source type for tag assignment (manual or AI)
 */
export type TagAssignmentSourceType = "MANUAL" | "AI";

/**
 * Interface for creating a tag assignment
 * Represents the data needed to assign a smart tag to an entity
 */
export interface ICreateTagAssignment {
	tagId: string;
	entityType: string; // 'CLIENT', 'COMMUNICATION', etc. (API format)
	entityId: string;
	status: string; // 'ACTIVE', 'INACTIVE'
}

/**
 * Interface for the assignment details within a tag assignment
 */
export interface ITagAssignmentDetail {
	tagId: string;
	entityType: ApplicableEntityApiType;
	entityId: string;
}

/**
 * Interface for the source information of a tag assignment
 */
export interface ITagAssignmentSource {
	type: TagAssignmentSourceType;
	aiModel: string | null;
	suggestedAt: string | null;
	approvedAt: string | null;
	context: string | null;
}

/**
 * Interface for a single tag assignment record
 */
export interface ITagAssignment {
	id: string;
	agencyId: string;
	companyId: string;
	createdBy: string;
	assignment: ITagAssignmentDetail;
	source: ITagAssignmentSource;
	status: TagAssignmentStatusApi;
	removedAt: string | null;
	removedBy: string | null;
	removalReason: string | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * Interface for the tag basic info in the assignments response
 */
export interface ITagAssignmentTagInfo {
	id: string;
	basicInfo: {
		title: string;
		description: string;
		color: string;
	};
}

/**
 * Interface for the response when getting tag assignments
 */
export interface ITagAssignmentsResponse {
	tag: ITagAssignmentTagInfo;
	tagAssignments: ITagAssignment[];
}

/**
 * Interface for tag assignment with enriched entity data (client/conversation/note info)
 */
export interface IEnrichedTagAssignment extends ITagAssignment {
	entityData?: {
		name: string;
		email?: string;
		phone?: string;
		avatarUrl?: string | null;
		// For conversations
		customerName?: string;
		lastMessage?: string;
		messagesCount?: number;
		// For notes
		noteContent?: string;
		noteType?: string;
		clientName?: string;
	};
}

/**
 * Interface for a tag assigned to an entity (simplified version for entity queries)
 */
export interface IEntityAssignedTag {
	assignmentId: string;
	tagId: string;
	title: string;
	description?: string;
	color?: string;
	status?: TagAssignmentStatusApi;
	sourceType?: TagAssignmentSourceType;
	createdAt?: string;
	updatedAt?: string;
}
