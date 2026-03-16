import { httpService } from "@http";
import type { IHttpClient } from "@http";
import type { ApplicableEntityApiType } from "../../domain/enums/applicable-entity.enum";
import type {
	ICreateTagAssignment,
	IEntityAssignedTag,
	ITagAssignmentsResponse,
} from "../../domain/interfaces/tag-assignment.interface";
import type { ITagAssignmentPort } from "../../domain/ports/tag-assignment.port";
import type {
	GetAssignmentsByEntityDataDto,
	GetTagAssignmentsDataDto,
} from "../dtos/tag-assignment.dto";
import {
	toCreateTagAssignmentRequest,
	toEntityAssignedTags,
	toTagAssignmentsResponse,
} from "../mappers/tag-assignment.mapper";

/**
 * Adapter for tag assignment operations
 */
export class AssignmentSmartTagAdapter implements ITagAssignmentPort {
	private readonly httpClient: IHttpClient = httpService;

	/**
	 * Assign a tag to a single entity
	 */
	async assignTag(assignment: ICreateTagAssignment): Promise<void> {
		const requestPayload = toCreateTagAssignmentRequest(assignment);
		const response = await this.httpClient.post<unknown>(
			"/tag-assignments",
			requestPayload
		);

		if (!response.success) {
			const errorMessage =
				response.error?.message ||
				response.error?.code ||
				"Failed to assign tag";
			throw new Error(errorMessage);
		}
	}

	/**
	 * Assign a tag to multiple entities at once
	 */
	async assignTagToMultiple(
		tagId: string,
		entityType: string,
		entityIds: string[]
	): Promise<void> {
		if (!entityIds || entityIds.length === 0) {
			throw new Error("At least one entity ID is required");
		}

		const assignments: ICreateTagAssignment[] = entityIds.map((entityId) => ({
			tagId,
			entityType,
			entityId,
			status: "ACTIVE",
		}));

		const assignmentPromises = assignments.map((assignment) =>
			this.assignTag(assignment)
		);

		await Promise.all(assignmentPromises);
	}

	/**
	 * Get all assignments for a specific tag
	 * @param tagId - The ID of the tag
	 * @param entityType - The type of entity to filter by (CLIENT, COMMUNICATION)
	 * @returns Promise with the tag assignments response
	 */
	async getTagAssignments(
		tagId: string,
		entityType: ApplicableEntityApiType
	): Promise<ITagAssignmentsResponse> {
		const response = await this.httpClient.get<GetTagAssignmentsDataDto>(
			"/tag-assignments",
			{
				params: {
					tagId,
					entityType,
				},
			}
		);

		if (response.success && response.data) {
			return toTagAssignmentsResponse(response.data);
		}

		const errorMessage =
			response.error?.message ||
			response.error?.code ||
			"Failed to get tag assignments";
		throw new Error(errorMessage);
	}

	/**
	 * Get all tag assignments for a specific entity (e.g., all tags assigned to a client)
	 * @param entityType - The type of entity (CLIENT, COMMUNICATION)
	 * @param entityId - The ID of the entity
	 * @returns Promise with array of assigned tags
	 */
	async getAssignmentsByEntity(
		entityType: ApplicableEntityApiType,
		entityId: string
	): Promise<IEntityAssignedTag[]> {
		const response = await this.httpClient.get<GetAssignmentsByEntityDataDto>(
			"/tag-assignments",
			{
				params: {
					entityType,
					entityId,
				},
			}
		);

		if (response.success && response.data) {
			return toEntityAssignedTags(response.data);
		}

		const errorMessage =
			response.error?.message ||
			response.error?.code ||
			"Failed to get entity assignments";
		throw new Error(errorMessage);
	}

	/**
	 * Delete a tag assignment by its ID
	 * @param assignmentId - The ID of the assignment to delete
	 */
	async deleteAssignment(assignmentId: string): Promise<void> {
		const response = await this.httpClient.delete<unknown>("/tag-assignments", {
			params: {
				ids: assignmentId,
			},
		});

		if (!response.success) {
			const errorMessage =
				response.error?.message ||
				response.error?.code ||
				"Failed to delete assignment";
			throw new Error(errorMessage);
		}
	}

	/**
	 * Delete multiple tag assignments by their IDs
	 * @param assignmentIds - Array of assignment IDs to delete
	 */
	async deleteMultipleAssignments(assignmentIds: string[]): Promise<void> {
		if (!assignmentIds || assignmentIds.length === 0) {
			throw new Error("At least one assignment ID is required");
		}

		const response = await this.httpClient.delete<unknown>("/tag-assignments", {
			params: {
				ids: assignmentIds.join(","),
			},
		});

		if (!response.success) {
			const errorMessage =
				response.error?.message ||
				response.error?.code ||
				"Failed to delete assignments";
			throw new Error(errorMessage);
		}
	}
}
