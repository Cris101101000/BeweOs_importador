import type { IAutomaticNotificationsPort } from '../domain/ports/automatic-notifications.port';
import type { IAutomaticNotificationConfig, IChannelConfig } from '../domain/interfaces/automatic-notification-config.interface';

/**
 * Use case for updating automatic notification configuration
 */
export class UpdateAutomaticNotificationUseCase {
	constructor(private readonly port: IAutomaticNotificationsPort) {}

	/**
	 * Executes the use case to update an automatic notification configuration
	 * @param updateData - Data to update the notification configuration
	 * @returns Promise with the updated automatic notification configuration
	 */
	async execute(
		updateData: {
			agencyId: string;
			companyId: string;
			handlerNamespace: string;
			channels: IChannelConfig[];
			isActive: boolean;
		}
	): Promise<IAutomaticNotificationConfig> {
		return await this.port.updateAutomaticNotification(updateData);
	}
}
