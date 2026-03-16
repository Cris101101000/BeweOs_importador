import type { INotification } from "src/shared/domain/interfaces/notification.interface";
import {
	FILTER_OPTIONS,
	NotificationFilter,
} from "../constants/notifications-panel.constants";

/**
 * Get the notification type configuration (key, icon, color)
 * @param type - The notification type
 * @returns The notification type configuration object
 */
export const getNotificationType = (type: INotification["type"]): { key: NotificationFilter; icon: string; color: string } => {
	return FILTER_OPTIONS.find((option: { key: NotificationFilter }) => option.key === type) ?? FILTER_OPTIONS[0];
};
