/**
 * Enum for applicable entities that can have smart tags
 * TODO: These will be fetched from an endpoint in the future
 * For now, they are mocked/hardcoded
 */
export enum ApplicableEntity {
	CLIENT = "client",
	COMMUNICATION = "communication",
	// CAMPAIGN = 'campaign',
	NOTE = "note",
	// DOCUMENT = 'document',
	// APPOINTMENT = 'appointment',
	// TRANSACTION = 'transaction',
	// FORM_SUBMISSION = 'form_submission',
	// OTHER = 'other',
	// // Legacy support - keep for backward compatibility
}

/**
 * Type representing the API format of entity types (uppercase keys from the enum)
 * Used for API responses where entityType comes as 'CLIENT' | 'COMMUNICATION'
 */
export type ApplicableEntityApiType = keyof typeof ApplicableEntity;
