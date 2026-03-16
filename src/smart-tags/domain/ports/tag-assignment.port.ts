import type { ApplicableEntityApiType } from "../enums/applicable-entity.enum";
import type {
	ICreateTagAssignment,
	IEntityAssignedTag,
	ITagAssignmentsResponse,
} from "../interfaces/tag-assignment.interface";

/**
 * Port interface for tag assignment operations
 */
export interface ITagAssignmentPort {
	/**
	 * Assign a tag to an entity
	 */
	assignTag(assignment: ICreateTagAssignment): Promise<void>;

	/**
	 * Assign a tag to multiple entities at once
	 */
	assignTagToMultiple(
		tagId: string,
		entityType: string,
		entityIds: string[]
	): Promise<void>;

	/**
	 * Get all assignments for a specific tag
	 * @param tagId - The ID of the tag
	 * @param entityType - The type of entity to filter by (CLIENT, COMMUNICATION)
	 * @returns Promise with the tag assignments response
	 */
	getTagAssignments(
		tagId: string,
		entityType: ApplicableEntityApiType
	): Promise<ITagAssignmentsResponse>;

	/**
	 * Get all tag assignments for a specific entity
	 * @param entityType - The type of entity (CLIENT, COMMUNICATION)
	 * @param entityId - The ID of the entity
	 * @returns Promise with array of assigned tags
	 */
	getAssignmentsByEntity(
		entityType: ApplicableEntityApiType,
		entityId: string
	): Promise<IEntityAssignedTag[]>;

	/**
	 * Delete a tag assignment by its ID
	 * @param assignmentId - The ID of the assignment to delete
	 */
	deleteAssignment(assignmentId: string): Promise<void>;

	/**
	 * Delete multiple tag assignments by their IDs
	 * @param assignmentIds - Array of assignment IDs to delete
	 */
	deleteMultipleAssignments(assignmentIds: string[]): Promise<void>;
}
