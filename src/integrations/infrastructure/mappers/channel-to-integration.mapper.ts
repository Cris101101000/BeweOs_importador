/**
 * Mapper to convert Channels API response to Integration domain types
 */

import { IntegrationStatus } from "../../domain/enums/integration-status.enum";
import { IntegrationCenterType } from "../../domain/interfaces/integration-center.interface";
import type { IIntegrationCenterItem } from "../../domain/interfaces/integration-center.interface";
import {
	type ChannelDto,
	ChannelStatus,
	ChannelType,
} from "../dtos/channels.dto";

/**
 * Maps API ChannelStatus to UI IntegrationStatus
 */
export function mapChannelStatusToIntegrationStatus(
	status: ChannelStatus,
	isActive: boolean
): IntegrationStatus {
	// If channel is not active, it's disabled regardless of status
	if (!isActive) {
		return IntegrationStatus.DISABLED;
	}

	const mapping: Record<ChannelStatus, IntegrationStatus> = {
		[ChannelStatus.ACTIVE]: IntegrationStatus.ENABLED,
		[ChannelStatus.INACTIVE]: IntegrationStatus.DISABLED,
		[ChannelStatus.PENDING]: IntegrationStatus.REGISTERING,
		[ChannelStatus.ERROR]: IntegrationStatus.ERROR,
		[ChannelStatus.MAINTENANCE]: IntegrationStatus.DISABLED,
	};

	return mapping[status] ?? IntegrationStatus.NOT_CONFIGURED;
}

/**
 * Maps API ChannelType to UI IntegrationCenterType
 */
export function mapChannelTypeToIntegrationCenterType(
	type: ChannelType
): IntegrationCenterType {
	const mapping: Record<ChannelType, IntegrationCenterType> = {
		[ChannelType.WHATSAPP]: IntegrationCenterType.WHATSAPP,
		[ChannelType.INSTAGRAM]: IntegrationCenterType.INSTAGRAM,
		// EMAIL is not currently supported in IntegrationCenterType, fallback to WHATSAPP
		[ChannelType.EMAIL]: IntegrationCenterType.WHATSAPP,
	};

	return mapping[type] ?? IntegrationCenterType.WHATSAPP;
}

/**
 * Extracts handler (phone number or username) from providerInfo
 */
function extractHandler(channel: ChannelDto): string {
	if (channel.providerInfo) {
		// Try common field names for handler
		const phoneNumber = channel.providerInfo.phoneNumber as string | undefined;
		const phone = channel.providerInfo.phone as string | undefined;
		const username = channel.providerInfo.username as string | undefined;
		const handle = channel.providerInfo.handle as string | undefined;

		return phoneNumber || phone || username || handle || "";
	}
	return "";
}

/**
 * Maps a single ChannelDto from API to IIntegrationCenterItem for UI
 */
export function mapChannelToIntegrationCenterItem(
	channel: ChannelDto
): IIntegrationCenterItem {
	return {
		id: channel.id,
		agencyId: channel.agencyId ?? null,
		companyId: channel.companyId ?? null,
		type: mapChannelTypeToIntegrationCenterType(channel.type),
		name: channel.name,
		handler: extractHandler(channel),
		status: mapChannelStatusToIntegrationStatus(
			channel.status,
			channel.isActive
		),
		createdAt: channel.createdAt,
		updatedAt: channel.updatedAt,
		deletedAt: null,
	};
}

/**
 * Maps an array of ChannelDto from API to IIntegrationCenterItem[] for UI
 */
export function mapChannelsToIntegrationCenterItems(
	channels: ChannelDto[]
): IIntegrationCenterItem[] {
	return channels.map(mapChannelToIntegrationCenterItem);
}
