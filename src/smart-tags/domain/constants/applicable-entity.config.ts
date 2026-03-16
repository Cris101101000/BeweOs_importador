import { ApplicableEntity } from "../enums/applicable-entity.enum.ts";

/**
 * Contact column display type for history table
 */
export type ContactColumnType = "email_phone" | "context" | "last_message";

/**
 * Configuration interface for applicable entities
 */
export interface ApplicableEntityConfigItem {
	translationKey: string;
	singularTranslationKey: string;
	icon: string;
	chipStyles: string;
	subTabKey: string;
	showAvatar: boolean;
	contactColumnType: ContactColumnType;
	contactColumnHeaderKey: string;
	navigationPath: string | null;
	/** Whether to show actions column (View button) */
	showActions: boolean;
}

/**
 * Configuration for applicable entities
 * Maps each entity to its translation keys, icons, and styles
 * This allows dynamic rendering based on enum values
 */
export const APPLICABLE_ENTITY_CONFIG: Record<
	ApplicableEntity,
	ApplicableEntityConfigItem
> = {
	[ApplicableEntity.CLIENT]: {
		translationKey: "smart_tags_applicable_client",
		singularTranslationKey: "smart_tags_assign_entity_client_singular",
		icon: "solar:user-bold",
		chipStyles: "bg-blue-50 text-blue-700 border-blue-200",
		subTabKey: "clients",
		showAvatar: true,
		contactColumnType: "email_phone",
		contactColumnHeaderKey: "smart_tags_table_column_contact",
		navigationPath: "/clients/details/{entityId}",
		showActions: true,
	},
	[ApplicableEntity.COMMUNICATION]: {
		translationKey: "smart_tags_applicable_communication",
		singularTranslationKey: "smart_tags_assign_entity_conversation_singular",
		icon: "solar:chat-round-dots-bold",
		chipStyles: "bg-purple-50 text-purple-700 border-purple-200",
		subTabKey: "conversations",
		showAvatar: true,
		contactColumnType: "last_message",
		contactColumnHeaderKey: "smart_tags_table_column_contact",
		navigationPath: "/conversaciones",
		showActions: true,
	},
	[ApplicableEntity.NOTE]: {
		translationKey: "smart_tags_applicable_note",
		singularTranslationKey: "smart_tags_assign_entity_note_singular",
		icon: "solar:document-text-bold",
		chipStyles: "bg-amber-50 text-amber-700 border-amber-200",
		subTabKey: "notes",
		showAvatar: false,
		contactColumnType: "context",
		contactColumnHeaderKey: "smart_tags_table_column_context",
		navigationPath: null,
		showActions: false,
	},
	// Future entities - uncomment and configure when needed:
	// [ApplicableEntity.CAMPAIGN]: {
	// 	translationKey: 'smart_tags_applicable_campaign',
	// 	singularTranslationKey: 'smart_tags_assign_entity_campaign_singular',
	// 	icon: 'solar:rocket-bold',
	// 	chipStyles: 'bg-orange-50 text-orange-700 border-orange-200',
	// 	subTabKey: 'campaigns',
	// 	showAvatar: false,
	// 	contactColumnType: 'context',
	// 	contactColumnHeaderKey: 'smart_tags_table_column_context',
	// 	navigationPath: '/campaigns/{entityId}',
	// },
};

/**
 * Helper function to get ApplicableEntity from sub-tab key
 */
export const getEntityFromSubTabKey = (
	subTabKey: string
): ApplicableEntity | null => {
	const entries = Object.entries(APPLICABLE_ENTITY_CONFIG) as [
		ApplicableEntity,
		ApplicableEntityConfigItem,
	][];
	const found = entries.find(([, config]) => config.subTabKey === subTabKey);
	return found ? found[0] : null;
};

/**
 * Helper function to get ApplicableEntity from API entity type
 */
export const getEntityFromApiType = (
	apiType: string
): ApplicableEntity | null => {
	const apiTypeToEntity: Record<string, ApplicableEntity> = {
		CLIENT: ApplicableEntity.CLIENT,
		COMMUNICATION: ApplicableEntity.COMMUNICATION,
		NOTE: ApplicableEntity.NOTE,
	};
	return apiTypeToEntity[apiType] || null;
};

/**
 * Get all available sub-tab keys from the configuration
 */
export const getAvailableSubTabKeys = (): string[] => {
	return Object.values(APPLICABLE_ENTITY_CONFIG).map(
		(config) => config.subTabKey
	);
};

/**
 * Type for history sub-tab keys - derived from configuration
 * This ensures type safety while being dynamic
 */
export type HistorySubTabKey =
	(typeof APPLICABLE_ENTITY_CONFIG)[ApplicableEntity]["subTabKey"];
