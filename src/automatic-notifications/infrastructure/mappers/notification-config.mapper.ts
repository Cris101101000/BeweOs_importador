import type { IAutomaticNotificationConfig } from '../../domain/interfaces/automatic-notification-config.interface';
import type { NotificationConfigDto } from '../dtos/notification-config.dto';

/**
 * Maps NotificationConfigDto from API to IAutomaticNotificationConfig domain object
 */
export const toAutomaticNotificationConfigFromDto = (
	dto: NotificationConfigDto
): IAutomaticNotificationConfig => {
	return {
		id: dto.id,
		handlerNamespace: dto.handlerNamespace,
		isActive: dto.isActive,
		channels: dto.channels,
		agencyId: dto.agencyId,
		companyId: dto.companyId,
		createdBy: dto.createdBy,
		createdAt: new Date(dto.createdAt),
		updatedAt: new Date(dto.updatedAt),
		isDeleted: dto.isDeleted,
		deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
		to: dto.to,
		from: dto.from
	};
};

/**
 * Maps array of NotificationConfigDto to array of IAutomaticNotificationConfig
 */
export const toAutomaticNotificationConfigsFromDto = (
	dtos: NotificationConfigDto[]
): IAutomaticNotificationConfig[] => {
	return dtos.map(toAutomaticNotificationConfigFromDto);
};
