import type { INotification } from "src/shared/domain/interfaces/notification.interface";
import type { INotificationPanelPort } from "../domain/ports/notification-panel.port";
import type { NotificationFilter } from "../domain/constants/notifications-panel.constants";

export class GetNotificationsUseCase {
	constructor(private readonly notificationPanelPort: INotificationPanelPort) {}

	async execute(filter?: NotificationFilter): Promise<INotification[]> {
		return await this.notificationPanelPort.getNotifications(filter);
	}
}

