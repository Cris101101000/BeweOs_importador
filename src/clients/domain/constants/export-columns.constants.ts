/**
 * Export Columns Constants
 *
 * Defines the default columns to be exported for client data
 */

/**
 * Default export columns for client data
 * These columns represent the core client information that should be exported by default
 */
export const DEFAULT_EXPORT_COLUMNS = [
	"contact", // Maps to "name" in API
	"email",
	"phone",
	"status",
	"potency", // Maps to "potential" in API
	// "gender",
	// "bussines",
	// "category",
	// "createdChannel",
	// "createdAt",
	// "updatedAt",
	// "lastCommunication",
	// "isActive",
	"ai_tags", // Maps to "tags" in API
] as const;

/**
 * Mapping from frontend column keys to API column values
 * The API only accepts: id, name, email, phone, status, potential, created_at, updated_at, tags
 */
export const FRONTEND_TO_API_COLUMN_MAP: Record<string, string> = {
	contact: "name",
	ai_tags: "tags",
	potency: "potential",
	name: "name",
	email: "email",
	phone: "phone",
	status: "status",
	potential: "potential",
	created_at: "created_at",
	updated_at: "updated_at",
	tags: "tags",
} as const;

/**
 * Valid API column values
 * These are the only column values accepted by the export API endpoint
 */
export const VALID_API_COLUMNS = [
	"id",
	"name",
	"email",
	"phone",
	"status",
	"potential",
	"created_at",
	"updated_at",
	"tags",
] as const;
