import type { IAutomaticNotificationConfig, IChannelConfig } from '../interfaces/automatic-notification-config.interface';

/**
 * Port interface for automatic notifications operations
 * Defines the contract for automatic notification configuration data operations
 */
export interface IAutomaticNotificationsPort {
	/**
	 * Retrieves all automatic notification configurations
	 * @param agencyId - Agency identifier
	 * @param companyId - Company identifier
	 * @returns Promise with array of automatic notification configurations
	 */
	getAutomaticNotifications(
		agencyId: string,
		companyId: string
	): Promise<IAutomaticNotificationConfig[]>;

	/**
	 * Updates a notification configuration
	 * @param updateData - Data to update the notification configuration
	 * @returns Promise with the updated automatic notification configuration
	 */
	updateAutomaticNotification(
		updateData: {
			agencyId: string;
			companyId: string;
			handlerNamespace: string;
			channels: IChannelConfig[];
			isActive: boolean;
		}
	): Promise<IAutomaticNotificationConfig>;
}
