import { useState, useEffect, useId } from 'react';
import { Card, Switch, Checkbox } from '@beweco/aurora-ui';
import { useTranslate } from '@tolgee/react';
import type { NotificationToggleCardProps } from '../../interfaces/notification-toggle-card.interface';
import type { IBusinessNotification } from '../../../domain/interfaces/business-notification.interface';
import type { IClientNotification } from '../../../domain/interfaces/client-notification.interface';
import type { IChannelConfig } from '../../../domain/interfaces/automatic-notification-config.interface';
import { ChannelStatus } from '../../../domain/interfaces/automatic-notification-config.interface';
import { NotificationConfirmModal } from './notification-confirm-modal.component';

const getChannelActive = (notification: IBusinessNotification | IClientNotification, channel: string): boolean => {
	const channels = (notification as unknown as { channels?: IChannelConfig[] }).channels;
	return channels?.find(c => c.channel === channel)?.status === ChannelStatus.ACTIVE;
};

export const NotificationToggleCard: React.FC<NotificationToggleCardProps> = ({
	notification,
	isLoading = false,
	isWhatsappAvailable = false,
	onToggle,
	onToggleWhatsapp,
	onToggleEmail,
}) => {
	const { t } = useTranslate();
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [pendingAction, setPendingAction] = useState<boolean | null>(null);

	const [emailEnabled, setEmailEnabled] = useState(getChannelActive(notification, 'email'));
	const [whatsappEnabled, setWhatsappEnabled] = useState(getChannelActive(notification, 'whatsapp'));

	// Sincronizar estado de canales con props
	useEffect(() => {
		setEmailEnabled(getChannelActive(notification, 'email'));
		setWhatsappEnabled(getChannelActive(notification, 'whatsapp'));
	}, [notification]);

	// IDs para accesibilidad
	const emailCheckboxId = useId();
	const whatsappCheckboxId = useId();

	const handleToggleClick = (newValue: boolean) => {
		setPendingAction(newValue);
		setIsConfirmModalOpen(true);
	};

	const handleConfirm = () => {
		if (pendingAction !== null) {
			onToggle(notification.id, pendingAction);
		}
		setIsConfirmModalOpen(false);
		setPendingAction(null);
	};

	const handleCancel = () => {
		setIsConfirmModalOpen(false);
		setPendingAction(null);
	};

	const handleEmailToggle = (value: boolean) => {
		// Validar que al menos un canal esté habilitado
		if (!value && (!isWhatsappAvailable || !whatsappEnabled)) {
			return; // No permitir desactivar si es el único canal activo
		}
		setEmailEnabled(value);
		onToggleEmail?.(notification.id, value);
	};

	const handleWhatsappToggle = (value: boolean) => {
		// Validar que al menos un canal esté habilitado
		if (!value && !emailEnabled) {
			return; // No permitir desactivar ambos canales
		}
		setWhatsappEnabled(value);
		onToggleWhatsapp?.(notification.id, value);
	};

	const isActivating = pendingAction === true;

	return (
		<>
			<Card className="p-4 border border-default-200 dark:border-default-800">
				{/* Header con título y switch */}
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex-1">
						<h3 className="font-semibold text-default-900 dark:text-default-100 text-base leading-tight mb-2">
							{t(notification.title)}
						</h3>
						<p className="text-sm text-default-600 dark:text-default-400 leading-relaxed line-clamp-2">
							{t(notification.description)}
						</p>
					</div>

					<Switch
						isSelected={notification.isEnabled}
						isDisabled={isLoading}
						onValueChange={handleToggleClick}
						size="md"
						color="success"
						aria-label={notification.isEnabled
							? t('notification_switch_disable_aria', 'Desactivar {title}', { title: t(notification.title) })
							: t('notification_switch_enable_aria', 'Activar {title}', { title: t(notification.title) })
						}
					/>
				</div>

				{/* Channel Options - Email & WhatsApp */}
				{notification.isEnabled && (
					<div className="py-3 border-t border-default-200 dark:border-default-800">
						<p className="text-xs text-default-500 dark:text-default-400 mb-2">
							{t('notification_channels', 'Canales de envío')}
						</p>
						<div className="flex items-center gap-4">
							{/* Email - Enabled by default but can be deselected */}
							<Checkbox
								id={emailCheckboxId}
								isSelected={emailEnabled}
								isDisabled={isLoading}
								onValueChange={handleEmailToggle}
								size="sm"
								color="primary"
								aria-label={t('notification_channel_email', 'Canal de notificación por Email')}
							>
								<span className="text-sm text-default-700 dark:text-default-300">
									{t('email', 'Email')}
								</span>
							</Checkbox>

							{/* WhatsApp - Solo visible si la integración está activa */}
							{isWhatsappAvailable && (
								<Checkbox
									id={whatsappCheckboxId}
									isSelected={whatsappEnabled}
									isDisabled={isLoading}
									onValueChange={handleWhatsappToggle}
									size="sm"
									color="primary"
									aria-label={t('notification_channel_whatsapp', 'Canal de notificación por WhatsApp')}
								>
									<span className="text-sm text-default-700 dark:text-default-300">
										{t('whatsapp', 'WhatsApp')}
									</span>
								</Checkbox>
							)}
						</div>
					</div>
				)}
			</Card>

			<NotificationConfirmModal
				isOpen={isConfirmModalOpen}
				onClose={handleCancel}
				onConfirm={handleConfirm}
				isLoading={isLoading}
				isActivating={isActivating}
				notificationTitle={notification.title}
			/>
		</>
	);
};
