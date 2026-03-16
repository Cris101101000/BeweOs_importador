import type { INotification } from "src/shared/domain/interfaces/notification.interface";
import type { NotificationFilter } from "../constants/notifications-panel.constants";

export interface INotificationPanelPort {
	getNotifications(filter?: NotificationFilter): Promise<INotification[]>;
}
