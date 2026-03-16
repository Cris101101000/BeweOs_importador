import type { IBusinessNotification } from '../../domain/interfaces/business-notification.interface';
import type { IClientNotification } from '../../domain/interfaces/client-notification.interface';

/**
 * Props for the NotificationToggleCard component
 */
export interface NotificationToggleCardProps {
	notification: IBusinessNotification | IClientNotification;
	isLoading?: boolean;
	isWhatsappAvailable?: boolean;
	onToggle: (notificationId: string, enabled: boolean) => void;
	onToggleWhatsapp?: (notificationId: string, enabled: boolean) => void;
	onToggleEmail?: (notificationId: string, enabled: boolean) => void;
	onSendTest?: (notificationId: string) => void;
}
