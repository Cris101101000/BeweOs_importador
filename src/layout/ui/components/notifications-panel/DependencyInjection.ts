import { GetNotificationsUseCase } from "../../../application/get-notifications.usecase";
import { NotificationPanelAdapter } from "../../../infrastructure/adapters/notification-panel.adapter";
import type { NotificationFilter } from "../../../domain/constants/notifications-panel.constants";
export {
	markNotificationAsReadViaSocket as MarkNotificationAsRead,
	markAllNotificationsAsReadViaSocket as MarkAllNotificationsAsRead,
} from "../../../infrastructure/hooks/useNotificationSocket";

const notificationPanelAdapter = new NotificationPanelAdapter();

export const GetNotifications = (filter?: NotificationFilter) =>
	new GetNotificationsUseCase(notificationPanelAdapter).execute(filter);
