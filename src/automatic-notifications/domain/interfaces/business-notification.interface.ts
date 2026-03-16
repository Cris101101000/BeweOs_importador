import type { IChannelConfig } from './automatic-notification-config.interface';

export interface IBusinessNotification {
	id: string;
	title: string;
	description: string;
	icon: string;
	isEnabled: boolean;
	category: NotificationCategory;
	channels: IChannelConfig[];
	handlerNamespace?: string;
	agencyId?: string;
	companyId?: string;
}

export enum NotificationCategory {
	SMB = 'SMB', // Notificaciones internas (SMB)
	CLIENT = 'CLIENT', // Notificaciones de clientes
}
