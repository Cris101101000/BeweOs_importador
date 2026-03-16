import type { IBusinessNotification } from '../../domain/interfaces/business-notification.interface';
import { NotificationCategory } from '../../domain/interfaces/business-notification.interface';
import type { IAutomaticNotificationConfig } from '../../domain/interfaces/automatic-notification-config.interface';
import { NOTIFICATION_AUTOMATICS_CONSTANTS } from '../../domain/constants/notification-automatics.constants';

/**
 * Gets title and description from constants using handlerNamespace
 * Returns default values if not found in constants
 */
const getNotificationInfo = (handlerNamespace: string): { title: string; description: string } => {
	const constantKey = handlerNamespace as keyof typeof NOTIFICATION_AUTOMATICS_CONSTANTS;
	const notificationInfo = NOTIFICATION_AUTOMATICS_CONSTANTS[constantKey];

	if (notificationInfo) {
		return {
			title: notificationInfo.title,
			description: notificationInfo.description,
		};
	}

	// Default values if not found in constants
	return {
		title: handlerNamespace,
		description: `Notificación automática: ${handlerNamespace}`,
	};
};

/**
 * Maps IAutomaticNotificationConfig to IBusinessNotification
 */
export const toBusinessNotificationFromConfig = (
	config: IAutomaticNotificationConfig
): IBusinessNotification => {
	const { title, description } = getNotificationInfo(config.handlerNamespace);
	const category = config.to === 'CLIENT' ? NotificationCategory.CLIENT : NotificationCategory.SMB;

	return {
		id: config.id,
		title,
		description,
		icon: 'solar:bell-bold', // Default icon, can be customized later
		isEnabled: config.isActive,
		category,
		channels: config.channels,
		handlerNamespace: config.handlerNamespace,
		agencyId: config.agencyId,
		companyId: config.companyId,
	};
};

/**
 * Maps array of IAutomaticNotificationConfig to array of IBusinessNotification
 */
export const toBusinessNotificationsFromConfig = (
	configs: IAutomaticNotificationConfig[]
): IBusinessNotification[] => {
	return configs.map(toBusinessNotificationFromConfig);
};
