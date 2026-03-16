import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, IconComponent } from '@beweco/aurora-ui';
import { useTranslate } from '@tolgee/react';

export interface NotificationConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading?: boolean;
	isActivating: boolean;
	notificationTitle: string;
}

export const NotificationConfirmModal: React.FC<NotificationConfirmModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading = false,
	isActivating,
	notificationTitle,
}) => {
	const { t } = useTranslate();

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose}
			size="md"
			placement="center"
			hideCloseButton
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-default-100 dark:bg-default-800">
									<IconComponent 
										icon={isActivating ? "solar:bell-bold" : "solar:bell-off-bold"} 
										className="w-5 h-5 text-default-600 dark:text-default-400"
										aria-hidden="true"
									/>
								</div>
								<span className="font-semibold text-default-900 dark:text-default-100">
									{isActivating 
										? t('confirm_activate_notification', 'Activar notificación')
										: t('confirm_deactivate_notification', 'Desactivar notificación')
									}
								</span>
							</div>
						</ModalHeader>
						<ModalBody>
							<div className="space-y-4">
								<p className="text-default-600 dark:text-default-400">
									{isActivating 
										? t('confirm_activate_notification_message', '¿Estás seguro de que deseas activar "{title}"?', { title: t(notificationTitle) })
										: t('confirm_deactivate_notification_message', '¿Estás seguro de que deseas desactivar "{title}"?', { title: t(notificationTitle) })
									}
								</p>

								<div className={`${isActivating ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800' : 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800'} border rounded-lg p-3`}>
									<div className="flex items-start gap-2">
										<IconComponent 
											icon={isActivating ? "solar:info-circle-bold" : "solar:danger-triangle-bold"}
											className={`w-4 h-4 ${isActivating ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'} mt-0.5 flex-shrink-0`}
											aria-hidden="true"
										/>
										<div>
											<p className={`text-sm font-medium ${isActivating ? 'text-success-800 dark:text-success-300' : 'text-warning-800 dark:text-warning-300'}`}>
												{isActivating 
													? t('notification_info', 'Información')
													: t('notification_warning', 'Advertencia')
												}
											</p>
											<p className={`text-xs ${isActivating ? 'text-success-700 dark:text-success-400' : 'text-warning-700 dark:text-warning-400'} mt-1`}>
												{isActivating 
													? t('notification_activate_info_message', 'Empezarás a recibir estas notificaciones automáticamente.')
													: t('notification_deactivate_info_message', 'Dejarás de recibir estas notificaciones hasta que las vuelvas a activar.')
												}
											</p>
										</div>
									</div>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button 
								color="default"
								variant="flat" 
								onPress={onClose}
								className="flex-1"
							>
								{t('button_cancel', 'Cancelar')}
							</Button>
							<Button 
								color="primary"
								onPress={onConfirm}
								isLoading={isLoading}
								className="flex-1"
								startContent={isActivating ? (
									<IconComponent 
										icon="solar:bell-bold"
										className="w-4 h-4"
										aria-hidden="true"
									/>
								) : undefined}
							>
								{isActivating 
									? t('button_activate', 'Activar')
									: t('button_deactivate', 'Desactivar')
								}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

