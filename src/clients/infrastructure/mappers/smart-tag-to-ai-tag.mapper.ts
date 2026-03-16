import type { ISmartTag } from "../../../smart-tags/domain/interfaces/smart-tags-interface";
import type { IEntityAssignedTag } from "../../../smart-tags/domain/interfaces/tag-assignment.interface";
import type { IAiTag } from "../../domain/interfaces/ai-tag.interface";

/**
 * Maps ISmartTag to IAiTag domain object
 * Used to convert smart tags from the API to the format expected by the manage tags modal
 */
export const toAiTagFromSmartTag = (smartTag: ISmartTag): IAiTag => ({
	id: smartTag.id,
	value: smartTag.name,
	color: smartTag.color,
	description: smartTag.description,
	createdAt: smartTag.createdAt
		? smartTag.createdAt instanceof Date
			? smartTag.createdAt.toISOString()
			: String(smartTag.createdAt)
		: undefined,
	updatedAt: smartTag.updatedAt
		? smartTag.updatedAt instanceof Date
			? smartTag.updatedAt.toISOString()
			: String(smartTag.updatedAt)
		: undefined,
});

/**
 * Maps array of ISmartTag to array of IAiTag
 */
export const toAiTagsFromSmartTags = (smartTags: ISmartTag[]): IAiTag[] =>
	smartTags.map(toAiTagFromSmartTag);

/**
 * Maps IEntityAssignedTag to IAiTag domain object
 * Used to convert assigned tags from the API to the format expected by the manage tags modal
 * Uses tagId as the id field
 */
export const toAiTagFromEntityAssignment = (
	assignment: IEntityAssignedTag
): IAiTag => ({
	id: assignment.tagId,
	value: assignment.title,
	color: assignment.color,
	description: assignment.description,
	createdAt: assignment.createdAt,
	updatedAt: assignment.updatedAt,
});

/**
 * Maps IEntityAssignedTag to IAiTag domain object for deletion operations
 * Uses assignmentId as the id field (required for DELETE /tag-assignments?ids=xxx)
 */
export const toAiTagFromEntityAssignmentWithAssignmentId = (
	assignment: IEntityAssignedTag
): IAiTag => ({
	id: assignment.assignmentId, // Use assignmentId for deletion
	value: assignment.title,
	color: assignment.color,
	description: assignment.description,
	createdAt: assignment.createdAt,
	updatedAt: assignment.updatedAt,
});

/**
 * Maps array of IEntityAssignedTag to array of IAiTag
 */
export const toAiTagsFromEntityAssignments = (
	assignments: IEntityAssignedTag[]
): IAiTag[] => assignments.map(toAiTagFromEntityAssignment);

/**
 * Maps array of IEntityAssignedTag to array of IAiTag with assignmentId for deletion
 */
export const toAiTagsFromEntityAssignmentsWithAssignmentId = (
	assignments: IEntityAssignedTag[]
): IAiTag[] => assignments.map(toAiTagFromEntityAssignmentWithAssignmentId);
