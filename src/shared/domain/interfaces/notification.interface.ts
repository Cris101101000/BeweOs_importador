/**
 * Notification domain interface
 */
export interface INotification {
	id: string;
	title: string;
	description: string;
	type: "low" | "normal" | "high" | "urgent";
	read: boolean;
	createdAt: Date;
	href?: string;
	hrefTitle?: string;
}

