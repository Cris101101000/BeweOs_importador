import { create } from "zustand";
import type { INotification } from "../../domain/interfaces/notification.interface";
import type {
	INotificationsState,
	INotificationsStore,
} from "./notifications.types";

const initialState: INotificationsState = {
	notifications: [], // Notifications are now loaded from the adapter in the component
	isOpen: false,
	hasNewNotification: false,
};

export const useNotificationsStore = create<INotificationsStore>((set) => ({
	...initialState,

	setNotifications: (notifications) => {
		set({ notifications });
	},

	addNotification: (notification) => {
		const newNotification: INotification = {
			...notification,
			id: crypto.randomUUID(),
			read: false,
			createdAt: new Date(),
		};
		set((state) => ({
			notifications: [newNotification, ...state.notifications],
			hasNewNotification: true,
		}));

		// Clear the flag after animation duration
		setTimeout(() => {
			set({ hasNewNotification: false });
		}, 3000);
	},

	addServerNotification: (notification) => {
		set((state) => {
			// Avoid duplicates by checking if notification already exists
			if (state.notifications.some((n) => n.id === notification.id)) {
				return state;
			}
			return {
				notifications: [notification, ...state.notifications],
				hasNewNotification: true,
			};
		});

		// Clear the flag after animation duration
		setTimeout(() => {
			set({ hasNewNotification: false });
		}, 3000);
	},

	markAsRead: (id) => {
		set((state) => ({
			notifications: state.notifications.map((n) =>
				n.id === id ? { ...n, read: true } : n
			),
		}));
	},

	markAllAsRead: () => {
		set((state) => ({
			notifications: state.notifications.map((n) => ({ ...n, read: true })),
		}));
	},

	removeNotification: (id) => {
		set((state) => ({
			notifications: state.notifications.filter((n) => n.id !== id),
		}));
	},

	clearAll: () => {
		set({ notifications: [] });
	},

	setIsOpen: (isOpen) => {
		console.log("setIsOpen", isOpen);
		set({ isOpen });
	},

	toggleOpen: () => {
		set((state) => ({ isOpen: !state.isOpen }));
	},

	clearNewNotificationFlag: () => {
		set({ hasNewNotification: false });
	},
}));

// Selector helpers
export const selectUnreadCount = (state: INotificationsStore) =>
	state.notifications.filter((n) => !n.read).length;

export const selectHasUnread = (state: INotificationsStore) =>
	state.notifications.some((n) => !n.read);
