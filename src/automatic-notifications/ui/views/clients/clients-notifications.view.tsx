import { useTranslate } from '@tolgee/react';
import { H3, useAuraToast } from '@beweco/aurora-ui';
import { NotificationToggleCard } from '../../components/notification-toggle-card/notification-toggle-card.component';
import { ViewSkeleton } from '@shared/ui/components/view-skeleton';
import { useClientNotifications } from '../../hooks/use-client-notifications.hook';
import { useChannels } from 'src/lindaConfig/ui/_shared/hooks/use-channels.hook';
import { configureSuccessToast } from '@shared/utils/toast-config.utils';

export const ClientsNotificationsView: React.FC = () => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const { notifications, isLoading, toggleNotification } = useClientNotifications();
	const { channelActiveStatus, isLoading: isChannelsLoading } = useChannels();

	const handleSendTest = (notificationId: string) => {
		const notification = notifications.find(n => n.id === notificationId);
		console.log('Enviar prueba de notificación:', notificationId);

		if (notification) {
			showToast(
				configureSuccessToast(
					t('test_notification_sent', 'Prueba enviada'),
					t('test_notification_sent_description', 'Se ha enviado una prueba de "{title}"', { title: notification.title })
				)
			);
		}
	};

	return (
		<div className="w-full space-y-6">
			<div className="mb-6">
				<H3>{t("client_notifications_title", "Notificaciones automáticas para clientes")}</H3>
				<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
					{t('test_notification_tooltip', 'La prueba será enviada al correo electrónico que configuraste en ajustes')}
				</p>
			</div>

			{/* Notifications Grid */}
			{isLoading || isChannelsLoading ? (
				<ViewSkeleton variant="grid" />
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{notifications && notifications.length > 0 ? (
						notifications.map((notification) => (
							<NotificationToggleCard
								key={notification.id}
								notification={notification}
								isLoading={isLoading}
								isWhatsappAvailable={channelActiveStatus.whatsapp}
								onToggle={toggleNotification}
								onSendTest={handleSendTest}
							/>
						))
					) : (
						<div className="col-span-full text-center py-12">
							<p className="text-gray-500 dark:text-gray-400 text-lg">
								{t('notifications_empty_state', 'No hay notificaciones disponibles')}
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
