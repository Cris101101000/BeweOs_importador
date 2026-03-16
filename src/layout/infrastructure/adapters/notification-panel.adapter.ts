import { type IHttpClient, httpService } from "@http";
import type { INotification } from "src/shared/domain/interfaces/notification.interface";
import { type INotificationPanelPort } from "../../domain/ports/notification-panel.port";
import type { NotificationFilter } from "../../domain/constants/notifications-panel.constants";
import {
	type ChannelMessageDto,
	mapChannelMessageToNotification,
} from "../mappers/notification.mapper";

interface PaginatedResponse<T> {
	items: T[];
	total: number;
}

export class NotificationPanelAdapter implements INotificationPanelPort {
	private readonly httpClient: IHttpClient = httpService;

	async getNotifications(filter?: NotificationFilter): Promise<INotification[]> {
		const qs = new URLSearchParams();
		qs.append("status", "SENT");
		qs.append("status", "DELIVERED");
		qs.append("type", "webpush");
		qs.append("category", "notification");

		// Use the API's priority filter when a specific type is selected
		if (filter && filter !== "all") {
			qs.append("priority", filter);
		}

		const response = await this.httpClient.get<PaginatedResponse<ChannelMessageDto>>(
			`/channels/messages?${qs.toString()}`,
		);

		if (response.success && response.data) {
			const data = response.data as PaginatedResponse<ChannelMessageDto>;
			const messages = data.items ?? [];
			return messages.map(mapChannelMessageToNotification);
		}

		return [];
	}
}
