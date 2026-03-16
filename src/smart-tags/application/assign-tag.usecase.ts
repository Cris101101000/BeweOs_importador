import type { ICreateTagAssignment } from "../domain/interfaces/tag-assignment.interface";
import type { ITagAssignmentPort } from "../domain/ports/tag-assignment.port";

/**
 * Use case for assigning tags to entities
 */
export class AssignTagUseCase {
	constructor(private tagAssignmentRepository: ITagAssignmentPort) {}

	/**
	 * Assign a tag to a single entity
	 */
	async assignTag(assignment: ICreateTagAssignment): Promise<void> {
		if (!assignment.tagId) {
			throw new Error("Tag ID is required");
		}
		if (!assignment.entityType) {
			throw new Error("Entity type is required");
		}
		if (!assignment.entityId) {
			throw new Error("Entity ID is required");
		}

		return this.tagAssignmentRepository.assignTag(assignment);
	}

	/**
	 * Assign a tag to multiple entities at once
	 */
	async assignTagToMultiple(
		tagId: string,
		entityType: string,
		entityIds: string[]
	): Promise<void> {
		if (!tagId) {
			throw new Error("Tag ID is required");
		}
		if (!entityType) {
			throw new Error("Entity type is required");
		}
		if (!entityIds || entityIds.length === 0) {
			throw new Error("At least one entity ID is required");
		}

		return this.tagAssignmentRepository.assignTagToMultiple(
			tagId,
			entityType,
			entityIds
		);
	}
}
