import type { INotification } from "../../domain/interfaces/notification.interface";

/**
 * Notifications store state
 */
export interface INotificationsState {
	notifications: INotification[];
	isOpen: boolean;
	hasNewNotification: boolean;
}

/**
 * Notifications store actions
 */
export interface INotificationsActions {
	setNotifications: (notifications: INotification[]) => void;
	addNotification: (
		notification: Omit<INotification, "id" | "read" | "createdAt">
	) => void;
	addServerNotification: (notification: INotification) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	removeNotification: (id: string) => void;
	clearAll: () => void;
	setIsOpen: (isOpen: boolean) => void;
	toggleOpen: () => void;
	clearNewNotificationFlag: () => void;
}

/**
 * Complete Notifications store type
 */
export type INotificationsStore = INotificationsState & INotificationsActions;

