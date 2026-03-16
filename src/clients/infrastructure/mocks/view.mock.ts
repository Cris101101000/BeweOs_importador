import { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import type { ViewResponseDto } from "../dtos/view.dto";

/**
 * Mock response for a single view
 */
export const mockViewResponse: ViewResponseDto = {
	id: "view-123",
	name: "Mi vista personalizada",
	description: "Vista personalizada para clientes VIP",
	entityType: "clients",
	filterConfig: {
		status: [EnumClientStatus.CLIENT],
		createdChannel: [EnumCreationChannel.Web],
		createdFrom: "2024-01-01",
		createdTo: "2024-12-31",
	},
	companyId: "3d64aa99-b9f5-49a4-a2a3-1e83bcc08949",
	userId: "user-123456789",
	createdAt: "2024-01-15T10:30:00Z",
	updatedAt: "2024-01-15T10:30:00Z",
	isDefault: false,
	isActive: true,
};

/**
 * Mock response for getting multiple views
 */
export const mockGetViewsResponse: ViewResponseDto[] = [
	mockViewResponse,
	{
		id: "view-124",
		name: "Clientes VIP",
		description: "Vista para clientes con categoría VIP",
		entityType: "clients",
		filterConfig: {
			status: [EnumClientStatus.CLIENT],
			createdChannel: [EnumCreationChannel.Web],
			createdFrom: "2024-01-01",
			createdTo: "2024-12-31",
			potentialTier: ["high"],
			tags: ["tag-001", "tag-002"],
		},
		companyId: "3d64aa99-b9f5-49a4-a2a3-1e83bcc08949",
		userId: "user-123456789",
		createdAt: "2024-01-10T08:00:00Z",
		updatedAt: "2024-01-10T08:00:00Z",
		isDefault: true,
		isActive: true,
	},
	{
		id: "view-125",
		name: "Nuevos clientes",
		description: "Vista para clientes recién registrados",
		entityType: "clients",
		filterConfig: {
			createdFrom: "2024-01-01",
			status: [EnumClientStatus.PROSPECT],
		},
		companyId: "3d64aa99-b9f5-49a4-a2a3-1e83bcc08949",
		userId: "user-123456789",
		createdAt: "2024-01-05T14:20:00Z",
		updatedAt: "2024-01-05T14:20:00Z",
		isDefault: false,
		isActive: true,
	},
];
