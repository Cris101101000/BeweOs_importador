import { httpService } from "@http";
import type { IHttpClient } from "@http";
import type { IAutomaticNotificationsPort } from "../../domain/ports/automatic-notifications.port";
import type { IAutomaticNotificationConfig } from "../../domain/interfaces/automatic-notification-config.interface";
import type { IChannelConfig } from "../../domain/interfaces/automatic-notification-config.interface";
import type {
	GetNotificationConfigsResponseDto,
	UpdateNotificationConfigRequestDto,
	UpdateNotificationConfigResponseDto,
} from "../dtos/notification-config.dto";
import {
	toAutomaticNotificationConfigFromDto,
	toAutomaticNotificationConfigsFromDto,
} from "../mappers/notification-config.mapper";

export class AutomaticNotificationsAdapter implements IAutomaticNotificationsPort {
	private readonly httpClient: IHttpClient = httpService;

	async getAutomaticNotifications(
		agencyId: string,
		companyId: string
	): Promise<IAutomaticNotificationConfig[]> {
		const queryParams = new URLSearchParams();
		queryParams.append("agencyId", agencyId);
		queryParams.append("companyId", companyId);

		const queryString = queryParams.toString();
		const url = `/notifications/configs?${queryString}`;

		const response = await this.httpClient.get<GetNotificationConfigsResponseDto>(url);

		if (response.success && response.data) {
			return toAutomaticNotificationConfigsFromDto(response.data);
		}

		if (!response.success) {
			throw new Error(response.error?.code || response.message || "API call failed");
		}

		throw new Error("Unexpected API response structure");
	}

	async updateAutomaticNotification(
		updateData: {
			agencyId: string;
			companyId: string;
			handlerNamespace: string;
			channels: IChannelConfig[];
			isActive: boolean;
		}
	): Promise<IAutomaticNotificationConfig> {
		const requestDto: UpdateNotificationConfigRequestDto = {
			agencyId: updateData.agencyId,
			companyId: updateData.companyId,
			handlerNamespace: updateData.handlerNamespace,
			channels: updateData.channels,
			isActive: updateData.isActive,
		};

		const url = '/notifications/configs';
		const response = await this.httpClient.patch<UpdateNotificationConfigResponseDto>(
			url,
			requestDto
		);

		if (response.success && response.data) {
			return toAutomaticNotificationConfigFromDto(response.data);
		}

		if (!response.success) {
			throw new Error(response.error?.code || response.message || "API call failed");
		}

		throw new Error("Unexpected API response structure");
	}
}
