import React from 'react';
import { Card, Chip, IconComponent, Button } from '@beweco/aurora-ui';
import { useTranslate } from '@tolgee/react';
import type { IClientNotification } from '../../../domain/interfaces/client-notification.interface';

export interface ClientNotificationCardProps {
	notification: IClientNotification;
	isLoading?: boolean;
	onToggle: (notificationId: string, enabled: boolean) => void;
	onSendTest?: (notificationId: string) => void;
}

export const ClientNotificationCard: React.FC<ClientNotificationCardProps> = ({
	notification,
	isLoading = false,
	onToggle,
	onSendTest,
}) => {
	const { t } = useTranslate();

	const handleToggle = () => {
		if (!isLoading) {
			onToggle(notification.id, !notification.isEnabled);
		}
	};

	// Determine status chip configuration
	const getStatusConfig = () => {
		if (notification.isEnabled) {
			return {
				chips: [
					{ label: t('integrated', 'Integrado'), color: 'success' as const },
					{ label: t('active', 'Activo'), color: 'primary' as const }
				],
				iconBg: 'bg-success-100 dark:bg-success-900/20',
				iconColor: 'text-success-600',
				buttonText: t('deactivate', 'Desactivar'),
				buttonVariant: 'bordered' as const,
				buttonColor: 'default' as const
			};
		}
		return {
			chips: [
				{ label: t('not_integrated', 'No integrado'), color: 'warning' as const }
			],
			iconBg: 'bg-default-100 dark:bg-default-50',
			iconColor: 'text-default-400',
			buttonText: t('activate', 'Activar'),
			buttonVariant: 'solid' as const,
			buttonColor: 'primary' as const
		};
	};

	const statusConfig = getStatusConfig();

	return (
		<Card className="p-6 border border-default-200 hover:shadow-lg hover:border-primary-200 transition-all duration-200 bg-white dark:bg-gray-950">
			{/* Status Chips - Top */}
			<div className="flex gap-2 mb-6 justify-center flex-wrap">
				{statusConfig.chips.map((chip, index) => (
					<Chip 
						key={index}
						color={chip.color}
						variant="flat"
						size="sm"
						className="font-medium"
					>
						{chip.label}
					</Chip>
				))}
			</div>

			{/* Icon - Large and Centered */}
			<div className="flex justify-center mb-6">
				<div className={`w-20 h-20 rounded-full flex items-center justify-center ${statusConfig.iconBg} transition-all duration-200`}>
					<IconComponent
						icon={notification.icon}
						className={`${statusConfig.iconColor} text-3xl`}
					/>
				</div>
			</div>

			{/* Title */}
			<h3 className="text-center font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2 leading-tight">
				{notification.title}
			</h3>

			{/* Description */}
			<p className="text-center text-sm text-default-600 dark:text-default-500 mb-6 min-h-[40px] leading-relaxed">
				{notification.description}
			</p>

			{/* Action Button - Primary */}
			<Button
				onPress={handleToggle}
				color={statusConfig.buttonColor}
				variant={statusConfig.buttonVariant}
				size="md"
				fullWidth
				isDisabled={isLoading}
				className="font-medium transition-all"
			>
				{statusConfig.buttonText}
			</Button>
			
			{/* Test Button - Only when enabled */}
			{notification.isEnabled && (
				<Button
					onPress={() => onSendTest?.(notification.id)}
					variant="light"
					size="sm"
					fullWidth
					className="mt-2"
					startContent={<IconComponent icon="solar:plain-outline" className="w-4 h-4" />}
				>
					{t('send_test', 'Enviar prueba')}
				</Button>
			)}
		</Card>
	);
};

