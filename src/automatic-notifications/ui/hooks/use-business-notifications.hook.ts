import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import { useAuraToast } from '@beweco/aurora-ui';
import type { IBusinessNotification } from '../../domain/interfaces/business-notification.interface';
import type { IChannelConfig } from '../../domain/interfaces/automatic-notification-config.interface';
import { ChannelStatus } from '../../domain/interfaces/automatic-notification-config.interface';
import { GetAutomaticNotificationsUseCase } from '../../application/get-automatic-notifications.usecase';
import { UpdateAutomaticNotificationUseCase } from '../../application/update-automatic-notification.usecase';
import { AutomaticNotificationsAdapter } from '../../infrastructure/adapters/automatic-notifications.adapter';
import { useSession } from '@shared/ui/contexts/session-context/session-context';
import { configureSuccessToast, configureErrorToastWithTranslation } from '@shared/utils/toast-config.utils';
import { EnumErrorType } from '@shared/domain/enums/enum-error-type.enum';
import { toBusinessNotificationFromConfig } from '../../infrastructure/mappers/business-notification.mapper';

function updateChannelInList(
	channels: IChannelConfig[],
	channelName: string,
	status: ChannelStatus,
): IChannelConfig[] {
	const exists = channels.some(c => c.channel === channelName);
	if (exists) {
		return channels.map(c =>
			c.channel === channelName ? { ...c, status } : c
		);
	}
	return [...channels, { channel: channelName, status }];
}

export const useBusinessNotifications = () => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const [notifications, setNotifications] = useState<IBusinessNotification[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { agency } = useSession();

	const adapter = useMemo(() => new AutomaticNotificationsAdapter(), []);
	const getNotificationsUseCase = useMemo(
		() => new GetAutomaticNotificationsUseCase(adapter),
		[adapter]
	);
	const updateNotificationUseCase = useMemo(
		() => new UpdateAutomaticNotificationUseCase(adapter),
		[adapter]
	);


	const fetchNotifications = useCallback(async () => {
		if (!agency?.id) {
			return;
		}

		setIsLoading(true);

		try {
			// change companyId to agency.companyId
			const businessNotifications = await getNotificationsUseCase.execute(agency.id, agency.id);
			setNotifications(businessNotifications);
		} catch (error) {
			console.error('Error fetching notifications:', error);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Network,
					t,
					'notifications_fetch_error',
					'try_again'
				)
			);
		} finally {
			setIsLoading(false);
		}
	}, [agency?.id, getNotificationsUseCase, showToast, t]);


	useEffect(() => {
		if (agency?.id) {
			fetchNotifications();
		}
	}, [agency?.id, fetchNotifications]);


	const updateNotification = useCallback(
		async (
			notificationId: string,
			updates: {
				isActive?: boolean;
				channels?: IChannelConfig[];
			}
		) => {
			if (!agency?.id) {
				return;
			}

			const notification = notifications.find((n) => n.id === notificationId);
			if (!notification || !notification.handlerNamespace) {
				console.error('Notification not found or missing handlerNamespace');
				return;
			}

			setIsLoading(true);

			try {
				const updatedConfig = await updateNotificationUseCase.execute({
					agencyId: notification.agencyId || agency.id,
					companyId: notification.companyId || agency.id,
					handlerNamespace: notification.handlerNamespace,
					channels: updates.channels ?? notification.channels,
					isActive: updates.isActive ?? notification.isEnabled ?? false,
				});

				const updatedNotification = toBusinessNotificationFromConfig(updatedConfig);
				setNotifications((prev) =>
					prev.map((n) => (n.id === notificationId ? updatedNotification : n))
				);

				showToast(
					configureSuccessToast(
						t('notifications_update_success', 'Notificación actualizada correctamente')
					)
				);
			} catch (error) {
				console.error('Error updating notification:', error);
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						'notifications_update_error',
						'try_again'
					)
				);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[agency?.id, notifications, updateNotificationUseCase, showToast, t]
	);


	const toggleNotification = useCallback(
		async (notificationId: string, enabled: boolean) => {
			await updateNotification(notificationId, { isActive: enabled });
		},
		[updateNotification]
	);

	const toggleEmail = useCallback(
		async (notificationId: string, enabled: boolean) => {
			const notification = notifications.find(n => n.id === notificationId);
			if (!notification) return;
			const updatedChannels = updateChannelInList(
				notification.channels,
				'email',
				enabled ? ChannelStatus.ACTIVE : ChannelStatus.INACTIVE,
			);
			await updateNotification(notificationId, { channels: updatedChannels });
		},
		[notifications, updateNotification]
	);

	const toggleWhatsapp = useCallback(
		async (notificationId: string, enabled: boolean) => {
			const notification = notifications.find(n => n.id === notificationId);
			if (!notification) return;
			const updatedChannels = updateChannelInList(
				notification.channels,
				'whatsapp',
				enabled ? ChannelStatus.ACTIVE : ChannelStatus.INACTIVE,
			);
			await updateNotification(notificationId, { channels: updatedChannels });
		},
		[notifications, updateNotification]
	);

	return {
		notifications,
		isLoading,
		toggleNotification,
		toggleEmail,
		toggleWhatsapp,
		refetch: fetchNotifications,
	};
};
