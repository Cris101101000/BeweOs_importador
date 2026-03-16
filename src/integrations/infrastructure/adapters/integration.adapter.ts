import { httpService } from "@shared/infrastructure/services/api-http.service";
import type { IHttpClient } from "@shared/infrastructure/services/api-http.service";
import {
	type IIntegration,
	type IIntegrationCenterItem,
	type IIntegrationPort,
	IntegrationCenterType,
	IntegrationStatus,
} from "../../domain";
import {
	type AvailableChannelsResponseDto,
	ChannelType,
	type ListChannelsResponseDto,
} from "../dtos/channels.dto";
import { mapChannelsToIntegrationCenterItems } from "../mappers/channel-to-integration.mapper";
import { mapCenterItemsToIntegrations } from "../mappers/integration-center-item.mapper";

/**
 * Maps ChannelType from available API to IntegrationCenterType
 */
function mapChannelTypeToIntegrationCenterType(
	type: ChannelType
): IntegrationCenterType | null {
	const mapping: Record<ChannelType, IntegrationCenterType | null> = {
		[ChannelType.WHATSAPP]: IntegrationCenterType.WHATSAPP,
		[ChannelType.INSTAGRAM]: IntegrationCenterType.INSTAGRAM,
		[ChannelType.EMAIL]: null, // Email no tiene IntegrationCenterType definido
	};
	return mapping[type] ?? null;
}

export class IntegrationAdapter implements IIntegrationPort {
	private readonly httpClient: IHttpClient = httpService;

	async getIntegrations(): Promise<IIntegration[]> {
		try {
			// Fetch both registered channels and available channel types in parallel
			const [registeredResponse, availableResponse] = await Promise.all([
				this.httpClient.get<ListChannelsResponseDto>("/channels"),
				this.httpClient.get<AvailableChannelsResponseDto>(
					"/channels/available"
				),
			]);

			console.log(
				"[IntegrationAdapter] Registered response:",
				registeredResponse
			);
			console.log(
				"[IntegrationAdapter] Available response:",
				availableResponse
			);

			// Process registered channels
			let registeredItems: IIntegrationCenterItem[] = [];
			if (registeredResponse.success && registeredResponse.data) {
				const channels = registeredResponse.data.channels;
				if (Array.isArray(channels)) {
					registeredItems = mapChannelsToIntegrationCenterItems(channels);
				}
			}

			console.log("[IntegrationAdapter] Registered items:", registeredItems);

			// Get set of registered channel types
			const registeredTypes = new Set(registeredItems.map((item) => item.type));
			console.log(
				"[IntegrationAdapter] Registered types:",
				Array.from(registeredTypes)
			);

			// Process available channels to create "not configured" entries
			const availableItems: IIntegrationCenterItem[] = [];
			if (availableResponse.success && availableResponse.data) {
				// Handle different response formats - API might return nested data structure
				const availableData = availableResponse.data as any;
				console.log(
					"[IntegrationAdapter] Available data structure:",
					availableData
				);

				// The API might return: { success: true, data: { channels: [...] } }
				// Or directly: { channels: [...] }
				// Or the array directly: [...]
				let availableChannels: any[] = [];

				if (Array.isArray(availableData)) {
					availableChannels = availableData;
				} else if (
					availableData.data &&
					Array.isArray(availableData.data.channels)
				) {
					// Nested: data.data.channels
					availableChannels = availableData.data.channels;
				} else if (availableData.data && Array.isArray(availableData.data)) {
					// Nested: data.data (array directly)
					availableChannels = availableData.data;
				} else if (Array.isArray(availableData.channels)) {
					// Direct: data.channels
					availableChannels = availableData.channels;
				}

				console.log(
					"[IntegrationAdapter] Available channels to process:",
					availableChannels
				);

				for (const availableChannel of availableChannels) {
					const channelType = availableChannel.type as ChannelType;
					const integrationCenterType =
						mapChannelTypeToIntegrationCenterType(channelType);

					console.log(
						`[IntegrationAdapter] Processing channel type: ${channelType} -> ${integrationCenterType}`
					);
					console.log(
						`[IntegrationAdapter] Is already registered: ${registeredTypes.has(integrationCenterType as any)}`
					);

					// Skip if no mapping exists or if already registered
					if (
						!integrationCenterType ||
						registeredTypes.has(integrationCenterType)
					) {
						console.log(
							`[IntegrationAdapter] Skipping ${channelType}: no mapping or already registered`
						);
						continue;
					}

					// Create "not configured" entry for available channel
					const newItem: IIntegrationCenterItem = {
						id: `available-${channelType}`,
						agencyId: null,
						companyId: null,
						type: integrationCenterType,
						name: this.getChannelDisplayName(channelType),
						handler: "",
						status: IntegrationStatus.NOT_CONFIGURED,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						deletedAt: null,
					};
					console.log("[IntegrationAdapter] Adding available item:", newItem);
					availableItems.push(newItem);
				}
			} else {
				console.log(
					"[IntegrationAdapter] Available response not successful or no data"
				);
			}

			console.log("[IntegrationAdapter] Available items:", availableItems);

			// Combine registered and available items
			const allItems = [...registeredItems, ...availableItems];
			console.log("[IntegrationAdapter] All items combined:", allItems);

			// Map to IIntegration format
			const result = mapCenterItemsToIntegrations(allItems);
			console.log("[IntegrationAdapter] Final result:", result);

			return result;
		} catch (error) {
			console.error("Error fetching integrations from API:", error);
			throw new Error("Failed to fetch integrations");
		}
	}

	/**
	 * Get display name for channel type
	 */
	private getChannelDisplayName(type: ChannelType): string {
		const names: Record<ChannelType, string> = {
			[ChannelType.WHATSAPP]: "WhatsApp Business",
			[ChannelType.INSTAGRAM]: "Instagram Business",
			[ChannelType.EMAIL]: "Email",
		};
		return names[type] ?? type;
	}

	async updateIntegrationStatus(
		id: string,
		status: IntegrationStatus
	): Promise<IIntegration> {
		try {
			// TODO: Implement real API call when endpoint is available
			// const response = await this.httpClient.patch(`/channels/${id}`, { status });

			const integrations = await this.getIntegrations();
			const integration = integrations.find(
				(integration) => integration.id === id
			);

			if (!integration) {
				throw new Error("Integration not found");
			}

			integration.status = status;
			integration.updatedAt = new Date();

			return integration;
		} catch (error) {
			console.error("Error updating integration status:", error);
			throw new Error("Failed to update integration status");
		}
	}
}
