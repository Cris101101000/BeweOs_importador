import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";

/**
 * Mock AI Tags Data
 *
 * Sample AI tags for development and testing purposes
 */
export const mockAiTags: IAiTag[] = [
	{
		id: "tag-001",
		value: "VIP Client",
		color: "#FFD700",
		icon: "crown",
		description: "High-value clients requiring premium service",

		createdAt: "2024-01-15T10:30:00Z",
		updatedAt: "2024-01-15T10:30:00Z",
	},
	{
		id: "tag-002",
		value: "Product A Interest",
		color: "#4CAF50",
		icon: "product",
		description: "Clients interested in Product A",

		createdAt: "2024-01-16T09:15:00Z",
		updatedAt: "2024-01-16T09:15:00Z",
	},
	{
		id: "tag-003",
		value: "Priority Follow-up",
		color: "#FF5722",
		icon: "clock",
		description: "Clients requiring immediate follow-up",

		createdAt: "2024-01-17T14:20:00Z",
		updatedAt: "2024-01-17T14:20:00Z",
	},
	{
		id: "tag-004",
		value: "Recurring Customer",
		color: "#2196F3",
		icon: "repeat",
		description: "Clients with recurring purchases",

		createdAt: "2024-01-18T11:45:00Z",
		updatedAt: "2024-01-18T11:45:00Z",
	},
	{
		id: "tag-005",
		value: "Hot Prospect",
		color: "#E91E63",
		icon: "fire",
		description: "High-potential leads",

		createdAt: "2024-01-19T16:30:00Z",
		updatedAt: "2024-01-19T16:30:00Z",
	},
	{
		id: "tag-006",
		value: "Needs Call",
		color: "#9C27B0",
		icon: "phone",
		description: "Clients requiring phone contact",

		createdAt: "2024-01-20T08:00:00Z",
		updatedAt: "2024-01-20T08:00:00Z",
	},
	{
		id: "tag-007",
		value: "High Budget",
		color: "#607D8B",
		icon: "dollar-sign",
		description: "Clients with significant budget capacity",

		createdAt: "2024-01-21T12:15:00Z",
		updatedAt: "2024-01-21T12:15:00Z",
	},
	{
		id: "tag-008",
		value: "Decision Maker",
		color: "#795548",
		icon: "user-check",
		description: "Primary decision makers in organizations",

		createdAt: "2024-01-22T15:45:00Z",
		updatedAt: "2024-01-22T15:45:00Z",
	},
	{
		id: "tag-009",
		value: "Technical Specialist",
		color: "#00BCD4",
		icon: "cog",
		description: "Clients with technical expertise",

		createdAt: "2024-01-23T13:30:00Z",
		updatedAt: "2024-01-23T13:30:00Z",
	},
	{
		id: "tag-010",
		value: "Frequent Buyer",
		color: "#8BC34A",
		icon: "shopping-cart",
		description: "Clients with frequent purchase history",

		createdAt: "2024-01-24T10:00:00Z",
		updatedAt: "2024-01-24T10:00:00Z",
	},
	{
		id: "tag-011",
		value: "Archived Tag",
		color: "#9E9E9E",
		icon: "archive",
		description: "Example of an inactive tag",

		createdAt: "2024-01-10T09:00:00Z",
		updatedAt: "2024-01-25T14:20:00Z",
	},
];

/**
 * Generate mock AI tag with custom data
 *
 * @param overrides - Properties to override in the mock tag
 * @returns Mock AI tag with overridden properties
 */
export const createMockAiTag = (overrides: Partial<IAiTag> = {}): IAiTag => {
	const baseTag: IAiTag = {
		id: `tag-${Date.now()}`,
		value: "Mock Tag",
		color: "#2196F3",
		icon: "tag",
		description: "Mock AI tag for testing",

		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	return { ...baseTag, ...overrides };
};

/**
 * Get filtered mock tags based on search criteria
 *
 * @param search - Search term to filter tags
 * @returns Filtered array of mock tags
 */
export const getFilteredMockTags = (search?: string): IAiTag[] => {
	let filteredTags = [...mockAiTags];

	// Filter by search term
	if (search && search.trim() !== "") {
		const searchTerm = search.toLowerCase().trim();
		filteredTags = filteredTags.filter(
			(tag) =>
				tag.value.toLowerCase().includes(searchTerm) ||
				tag.description?.toLowerCase().includes(searchTerm)
		);
	}

	return filteredTags;
};
