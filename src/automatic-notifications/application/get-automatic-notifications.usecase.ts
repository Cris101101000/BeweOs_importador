import type { IAutomaticNotificationsPort } from '../domain/ports/automatic-notifications.port';
import type { IBusinessNotification } from '../domain/interfaces/business-notification.interface';
import { NotificationCategory } from '../domain/interfaces/business-notification.interface';
import { toBusinessNotificationsFromConfig } from '../infrastructure/mappers/business-notification.mapper';

/**
 * Use case for getting automatic notifications
 */
export class GetAutomaticNotificationsUseCase {
	constructor(private readonly port: IAutomaticNotificationsPort) {}

	/**
	 * Executes the use case to get all automatic notifications
	 * @param agencyId - Agency identifier
	 * @param companyId - Company identifier
	 * @returns Promise with array of business notifications
	 */
	async execute(
		agencyId: string,
		companyId: string
	): Promise<IBusinessNotification[]> {
		const configs = await this.port.getAutomaticNotifications(agencyId, companyId);
		const allNotifications = toBusinessNotificationsFromConfig(configs);
		// Filter only SMB (business) notifications
		const businessNotifications = allNotifications.filter(
			(notification) => notification.category === NotificationCategory.SMB
		);
		return businessNotifications;
	}
}

