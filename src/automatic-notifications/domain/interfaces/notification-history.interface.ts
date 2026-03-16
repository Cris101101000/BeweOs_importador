export interface INotificationHistory {
	id: string;
	type: string;
	title: string;
	recipient: string;
	status: NotificationHistoryStatus;
	sentAt: string;
	channel: NotificationChannel;
	content?: string;
	errorMessage?: string;
	isAiGenerated: boolean;
}

export enum NotificationHistoryStatus {
	SENT = 'sent',
	FAILED = 'failed',
	PENDING = 'pending',
	DELIVERED = 'delivered'
}

export enum NotificationChannel {
	EMAIL = 'email',
	SMS = 'sms',
	WHATSAPP = 'whatsapp',
	PUSH = 'push'
}
