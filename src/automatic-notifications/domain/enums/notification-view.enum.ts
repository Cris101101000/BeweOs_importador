export enum NotificationViewMode {
	Business = "business",
	Clients = "clients",
}

export const NOTIFICATION_VIEW_PATHS = {
	[NotificationViewMode.Business]: "/notificaciones-automaticas/business",
	[NotificationViewMode.Clients]: "/notificaciones-automaticas/clients",
};
