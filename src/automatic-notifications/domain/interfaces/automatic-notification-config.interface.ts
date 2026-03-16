/**
 * Domain interface for automatic notification configuration
 * Represents the configuration of an automatic notification handler
 */

export enum ChannelStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	ACTIVATING = 'activating',
	ERROR = 'error',
}

export interface IChannelConfig {
	channel: string;
	status: ChannelStatus;
}

export interface IAutomaticNotificationConfig {
	id: string;
	handlerNamespace: string;
	isActive: boolean;
	channels: IChannelConfig[];
	agencyId: string;
	companyId: string;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	isDeleted: boolean;
	deletedAt: Date | null;
	to?: 'SMB' | 'CLIENT';
	from?: 'SMB' | 'AGENCY' | 'SYSTEM';
}
