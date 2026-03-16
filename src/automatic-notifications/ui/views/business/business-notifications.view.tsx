import { useTranslate } from '@tolgee/react';
import { H3, useAuraToast } from '@beweco/aurora-ui';
import { NotificationToggleCard } from '../../components/notification-toggle-card/notification-toggle-card.component';
import { ViewSkeleton } from '@shared/ui/components/view-skeleton';
import { useBusinessNotifications } from '../../hooks/use-business-notifications.hook';
import { useChannels } from 'src/lindaConfig/ui/_shared/hooks/use-channels.hook';
import { configureSuccessToast } from '@shared/utils/toast-config.utils';

export const BusinessNotificationsView: React.FC = () => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const { notifications, isLoading, toggleNotification, toggleEmail, toggleWhatsapp } = useBusinessNotifications();
	const { channelActiveStatus, isLoading: isChannelsLoading } = useChannels();


	const handleSendTest = (notificationId: string) => {
		const notification = notifications.find(n => n.id === notificationId);
		console.log('Enviar prueba de notificación:', notificationId);
		// TODO: Implementar lógica de envío de prueba

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
		<div className="space-y-6">
			<div className="mb-6">
				<H3>{t("business_notifications_title", "Notificaciones automáticas para el negocio")}</H3>
				<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
					{t('test_notification_tooltip', 'La prueba será enviada al correo electrónico que configuraste en ajustes')}
				</p>
			</div>

			{isLoading || isChannelsLoading ? (
				<ViewSkeleton variant="grid" />
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{notifications.map((notification) => (
						<NotificationToggleCard
							key={notification.id}
							notification={notification}
							isLoading={isLoading}
							isWhatsappAvailable={channelActiveStatus.whatsapp}
							onToggle={toggleNotification}
							onToggleEmail={toggleEmail}
							onToggleWhatsapp={toggleWhatsapp}
							onSendTest={handleSendTest}
						/>
					))}
				</div>
			)}
		</div>
	);
};
