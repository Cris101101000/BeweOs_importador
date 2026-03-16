export interface IClientNotification {
	id: string;
	title: string;
	description: string;
	icon: string;
	isEnabled: boolean;
	category: ClientNotificationCategory;
}

export enum ClientNotificationCategory {
	COMMUNICATION = 'communication',
	MARKETING = 'marketing', 
	REMINDERS = 'reminders',
	FEEDBACK = 'feedback',
}
