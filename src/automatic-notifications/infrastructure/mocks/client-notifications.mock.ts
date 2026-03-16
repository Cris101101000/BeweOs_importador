import type { IClientNotification } from '../../domain/interfaces/client-notification.interface';
import { ClientNotificationCategory } from '../../domain/interfaces/client-notification.interface';

export const mockClientNotifications: IClientNotification[] = [
	{
		id: 'welcome-messages-7days',
		title: 'Mensaje de bienvenida',
		description: 'Enviar mensaje de bienvenida automático a los 7 días de la primera conversación con el cliente',
		icon: 'solar:hand-heart-bold',
		isEnabled: true,
		category: ClientNotificationCategory.COMMUNICATION,
	},
	{
		id: 'follow-up-3days',
		title: 'Mensaje de seguimiento',
		description: 'Enviar mensaje de seguimiento automático a los 3 días después de una conversación',
		icon: 'solar:chat-round-call-bold',
		isEnabled: false,
		category: ClientNotificationCategory.COMMUNICATION,
	},
	{
		id: 'birthday-notifications',
		title: 'Notificación por cumpleaños',
		description: 'Enviar felicitación automática a los clientes en su día de cumpleaños',
		icon: 'solar:gift-bold',
		isEnabled: false,
		category: ClientNotificationCategory.REMINDERS,
	},
	{
		id: 'appointment-reminder',
		title: 'Recordatorio de citas',
		description: 'Recordatorio automático 24 horas antes de una cita programada',
		icon: 'solar:calendar-mark-bold',
		isEnabled: true,
		category: ClientNotificationCategory.REMINDERS,
	},
	{
		id: 'feedback-request',
		title: 'Solicitud de feedback',
		description: 'Solicita opiniones y reseñas después de completar un servicio',
		icon: 'solar:star-bold',
		isEnabled: false,
		category: ClientNotificationCategory.FEEDBACK,
	},
	{
		id: 'promotional-offers',
		title: 'Ofertas promocionales',
		description: 'Envía ofertas y promociones especiales personalizadas a tus clientes',
		icon: 'solar:ticket-sale-bold',
		isEnabled: false,
		category: ClientNotificationCategory.MARKETING,
	},
];
