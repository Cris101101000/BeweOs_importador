import type { IChannelConfig } from '../../domain/interfaces/automatic-notification-config.interface';

export interface NotificationConfigDto {
	id: string;
	handlerNamespace: string;
	isActive: boolean;
	channels: IChannelConfig[];
	agencyId: string;
	companyId: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	isDeleted: boolean;
	deletedAt: string | null;
	to?: 'SMB' | 'CLIENT';
	from?: 'SMB' | 'AGENCY' | 'SYSTEM';
}
export interface GetNotificationConfigsResponseDto {
	success: boolean;
	message: string;
	data: NotificationConfigDto[];
	timestamp: string;
}

export interface UpdateNotificationConfigRequestDto {
	agencyId: string;
	companyId: string;
	handlerNamespace: string;
	channels: IChannelConfig[];
	isActive: boolean;
}

export interface UpdateNotificationConfigResponseDto {
	success: boolean;
	message: string;
	data: NotificationConfigDto;
	timestamp: string;
}
