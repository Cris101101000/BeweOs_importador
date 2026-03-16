export enum SmartTagStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	DRAFT = "draft",
}

/**
 * Type representing the API format of tag assignment status (uppercase)
 * Used for API responses where status comes as 'ACTIVE' | 'INACTIVE'
 */
export type TagAssignmentStatusApi = "ACTIVE" | "INACTIVE";
