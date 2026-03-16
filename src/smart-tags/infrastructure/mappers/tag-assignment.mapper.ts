import type {
	ICreateTagAssignment,
	IEntityAssignedTag,
	ITagAssignment,
	ITagAssignmentTagInfo,
	ITagAssignmentsResponse,
} from "../../domain/interfaces/tag-assignment.interface";
import type {
	CreateTagAssignmentRequestDto,
	EntityAssignmentResponseItemDto,
	GetTagAssignmentsDataDto,
	TagAssignmentDto,
	TagAssignmentTagInfoDto,
} from "../dtos/tag-assignment.dto";

/**
 * Maps domain assignment to API request DTO
 */
export function toCreateTagAssignmentRequest(
	assignment: ICreateTagAssignment
): CreateTagAssignmentRequestDto {
	return {
		assignment: {
			tagId: assignment.tagId,
			entityType: assignment.entityType,
			entityId: assignment.entityId,
		},
		status: assignment.status,
	};
}

/**
 * Maps a tag assignment DTO from the API to a domain interface
 */
export function toTagAssignment(dto: TagAssignmentDto): ITagAssignment {
	return {
		id: dto.id,
		agencyId: dto.agencyId,
		companyId: dto.companyId,
		createdBy: dto.createdBy,
		assignment: {
			tagId: dto.assignment.tagId,
			entityType: dto.assignment.entityType,
			entityId: dto.assignment.entityId,
		},
		source: {
			type: dto.source.type,
			aiModel: dto.source.aiModel,
			suggestedAt: dto.source.suggestedAt,
			approvedAt: dto.source.approvedAt,
			context: dto.source.context,
		},
		status: dto.status,
		removedAt: dto.removedAt,
		removedBy: dto.removedBy,
		removalReason: dto.removalReason,
		createdAt: dto.createdAt,
		updatedAt: dto.updatedAt,
	};
}

/**
 * Maps tag info DTO to domain interface
 */
export function toTagAssignmentTagInfo(
	dto: TagAssignmentTagInfoDto
): ITagAssignmentTagInfo {
	return {
		id: dto.id,
		basicInfo: {
			title: dto.basicInfo.title,
			description: dto.basicInfo.description,
			color: dto.basicInfo.color,
		},
	};
}

/**
 * Maps the full tag assignments response DTO to domain interface
 * Handles cases where tag or tagAssignments may be undefined
 */
export function toTagAssignmentsResponse(
	dto: GetTagAssignmentsDataDto
): ITagAssignmentsResponse {
	// Handle case where tag is undefined (no assignments exist)
	const tag: ITagAssignmentTagInfo = dto.tag
		? toTagAssignmentTagInfo(dto.tag)
		: {
				id: "",
				basicInfo: {
					title: "",
					description: "",
					color: "",
				},
			};

	// Handle case where tagAssignments is undefined or empty
	const tagAssignments = dto.tagAssignments?.map(toTagAssignment) ?? [];

	return {
		tag,
		tagAssignments,
	};
}

/**
 * Maps the entity assignments response from API to domain interface array
 */
export function toEntityAssignedTags(dto: unknown): IEntityAssignedTag[] {
	if (!Array.isArray(dto)) {
		return [];
	}

	return (dto as EntityAssignmentResponseItemDto[]).map(
		(item): IEntityAssignedTag => {
			const tag = item.tag;
			// tagAssignments is an array, take the first item
			const assignment = item.tagAssignments?.[0];

			return {
				assignmentId: assignment?.id || "",
				tagId: tag?.id || "",
				title: tag?.basicInfo?.title || "",
				description: tag?.basicInfo?.description || "",
				color: tag?.basicInfo?.color || "",
				status: assignment?.status as IEntityAssignedTag["status"],
				sourceType: assignment?.source
					?.type as IEntityAssignedTag["sourceType"],
				createdAt: assignment?.createdAt,
				updatedAt: assignment?.updatedAt,
			};
		}
	);
}
