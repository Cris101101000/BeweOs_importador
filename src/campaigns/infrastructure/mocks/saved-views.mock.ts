import type { ISavedView } from "@campaigns/domain/audience/interfaces/Audience";

/**
 * Mock de vistas guardadas del CRM
 */
export const MOCK_SAVED_VIEWS: ISavedView[] = [
	{
		id: "a2bbdc71-4109-4644-b5a5-00063242b038",
		name: "tag cvlient",
		description: "",
		entityType: "clients",
		filterConfig: {
			tags: ["tag client"],
		},
		userId: "eb420b46-96bd-46a1-846b-eaa4de0f323e",
		companyId: "370a5c02-c06b-4646-9a4b-1f2033e1a5cc",
		isDefault: false,
		isActive: true,
		createdAt: "2026-01-07T16:52:47.047Z",
		updatedAt: "2026-01-07T16:52:47.047Z",
	},
	{
		id: "edf933b7-62b7-48cb-a5b1-d1948f570b20",
		name: "cliente medio",
		description: "",
		entityType: "clients",
		filterConfig: {
			status: ["client"],
			potentialTier: ["medium"],
		},
		userId: "eb420b46-96bd-46a1-846b-eaa4de0f323e",
		companyId: "370a5c02-c06b-4646-9a4b-1f2033e1a5cc",
		isDefault: false,
		isActive: true,
		createdAt: "2026-01-07T16:51:55.872Z",
		updatedAt: "2026-01-07T16:51:55.872Z",
	},
];

/**
 * Mock del total de clientes en el CRM
 */
export const MOCK_TOTAL_CLIENTS_COUNT = 324;
